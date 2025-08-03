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
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "メールアドレスとパスワードが必要です" },
        { status: 400 },
      );
    }

    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.NEXT_PUBLIC_AUTH_USER_POOL_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const response = await cognitoClient.send(command);

    if (response.AuthenticationResult?.AccessToken) {
      // レスポンスを作成
      const jsonResponse = NextResponse.json({
        accessToken: response.AuthenticationResult.AccessToken,
        message: "サインインに成功しました",
      });

      // リフレッシュトークンをhttpOnly Cookieに設定
      if (response.AuthenticationResult.RefreshToken) {
        jsonResponse.cookies.set(
          "refreshToken",
          response.AuthenticationResult.RefreshToken,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7日
          },
        );
      }

      return jsonResponse;
    } else {
      return NextResponse.json(
        { message: "認証に失敗しました" },
        { status: 401 },
      );
    }
  } catch (error: any) {
    console.error("Sign in error:", error);

    if (error.name === "NotAuthorizedException") {
      return
NextResponse.json(
        { message: "メールアドレスまたはパスワードが正しくありません" },
        { status: 401 },
      );
    }

    if (error.name === "UserNotConfirmedException") {
      return NextResponse.json(
        { message: "アカウントが確認されていません" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "サインインに失敗しました" },
      { status: 500 },
    );
  }
} 