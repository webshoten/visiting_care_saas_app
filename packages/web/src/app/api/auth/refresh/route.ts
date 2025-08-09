import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { type NextRequest, NextResponse } from "next/server";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "ap-northeast-1",
});

export async function POST(request: NextRequest) {
  try {
    // リフレッシュトークンをCookieから取得
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "リフレッシュトークンが見つかりません" },
        { status: 401 },
      );
    }

    const command = new InitiateAuthCommand({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: process.env.NEXT_PUBLIC_AUTH_USER_POOL_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });

    const response = await cognitoClient.send(command);

    if (response.AuthenticationResult?.AccessToken) {
      // レスポンスを作成（アクセストークンは含めない）
      const jsonResponse = NextResponse.json({
        message: "トークンの更新に成功しました",
      });

      // 新しいアクセストークンをhttpOnly Cookieに設定
      jsonResponse.cookies.set(
        "accessToken",
        response.AuthenticationResult.AccessToken,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 15 * 60, // 15分
        },
      );

      return jsonResponse;
    } else {
      return NextResponse.json(
        { message: "トークンの更新に失敗しました" },
        { status: 401 },
      );
    }
  } catch (error: any) {
    console.error("Token refresh error:", error);

    if (error.name === "NotAuthorizedException") {
      return NextResponse.json(
        { message: "リフレッシュトークンが無効です" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { message: "トークンの更新に失敗しました" },
      { status: 500 },
    );
  }
}
