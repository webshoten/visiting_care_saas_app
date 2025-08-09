import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { type NextRequest, NextResponse } from "next/server";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "ap-northeast-1",
});

export async function GET(request: NextRequest) {
  try {
    // アクセストークンをCookieから取得
    let accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      // アクセストークンがない場合は、リフレッシュを試行
      const refreshToken = request.cookies.get("refreshToken")?.value;
      if (!refreshToken) {
        return NextResponse.json(
          { message: "認証が必要です" },
          { status: 401 },
        );
      }

      // リフレッシュを試行（簡易的に/api/auth/tokenを内部で呼び出す代わりに、直接リフレッシュ）
      try {
        const { CognitoIdentityProviderClient, InitiateAuthCommand } =
          await import("@aws-sdk/client-cognito-identity-provider");

        const refreshClient = new CognitoIdentityProviderClient({
          region: process.env.AWS_REGION || "ap-northeast-1",
        });

        const refreshCommand = new InitiateAuthCommand({
          AuthFlow: "REFRESH_TOKEN_AUTH",
          ClientId: process.env.NEXT_PUBLIC_AUTH_USER_POOL_CLIENT_ID,
          AuthParameters: {
            REFRESH_TOKEN: refreshToken,
          },
        });

        const refreshResponse = await refreshClient.send(refreshCommand);
        accessToken = refreshResponse.AuthenticationResult?.AccessToken;

        if (!accessToken) {
          return NextResponse.json(
            { message: "認証が期限切れです" },
            { status: 401 },
          );
        }
      } catch (refreshError) {
        return NextResponse.json(
          { message: "認証が期限切れです" },
          { status: 401 },
        );
      }
    }

    // Cognitoからユーザー情報を取得
    const command = new GetUserCommand({
      AccessToken: accessToken,
    });

    const response = await cognitoClient.send(command);

    // ユーザー属性を整理
    const userAttributes: Record<string, string> = {};
    response.UserAttributes?.forEach((attr) => {
      if (attr.Name && attr.Value) {
        userAttributes[attr.Name] = attr.Value;
      }
    });

    return NextResponse.json({
      username: response.Username,
      userAttributes,
      mfaOptions: response.MFAOptions,
      preferredMfaSetting: response.PreferredMfaSetting,
      userMFASettingList: response.UserMFASettingList,
    });
  } catch (error: any) {
    console.error("Get user error:", error);

    if (error.name === "NotAuthorizedException") {
      return NextResponse.json({ message: "認証が無効です" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "ユーザー情報の取得に失敗しました" },
      { status: 500 },
    );
  }
}
