import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { type NextRequest, NextResponse } from "next/server";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "ap-northeast-1",
});

/**
 * トークンの有効期限をチェックする関数
 */
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000; // ミリ秒に変換
    return Date.now() >= expirationTime;
  } catch {
    return true; // パースエラーの場合は期限切れとみなす
  }
};

export async function GET(request: NextRequest) {
  try {
    // アクセストークンをCookieから取得
    const accessToken = request.cookies.get("accessToken")?.value;

    // アクセストークンが存在し、有効期限内の場合はそのまま返す
    if (accessToken && !isTokenExpired(accessToken)) {
      return NextResponse.json({
        accessToken,
        message: "有効なアクセストークンを取得しました",
      });
    }

    // アクセストークンが期限切れまたは存在しない場合、リフレッシュを試行
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: "認証が必要です" }, { status: 401 });
    }

    // リフレッシュトークンを使用して新しいアクセストークンを取得
    const command = new InitiateAuthCommand({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: process.env.NEXT_PUBLIC_AUTH_USER_POOL_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });

    const response = await cognitoClient.send(command);

    if (response.AuthenticationResult?.AccessToken) {
      const newAccessToken = response.AuthenticationResult.AccessToken;

      // レスポンスを作成
      const jsonResponse = NextResponse.json({
        accessToken: newAccessToken,
        message: "アクセストークンを更新しました",
      });

      // 新しいアクセストークンをhttpOnly Cookieに設定
      jsonResponse.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60, // 15分
      });

      return jsonResponse;
    } else {
      return NextResponse.json(
        { message: "トークンの更新に失敗しました" },
        { status: 401 },
      );
    }
  } catch (error: any) {
    console.error("Token retrieval error:", error);

    if (error.name === "NotAuthorizedException") {
      return NextResponse.json(
        { message: "認証が期限切れです。再度ログインしてください。" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { message: "トークンの取得に失敗しました" },
      { status: 500 },
    );
  }
}
