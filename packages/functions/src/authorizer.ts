/**
 * Lambda Authorizer for API Gateway
 *
 * JWTトークンの検証を行う本実装
 */

import { CognitoJwtVerifier } from "aws-jwt-verify";
import type { APIGatewayProxyEventV2 } from "aws-lambda";

// JWTトークンの検証器を初期化
const verifier = CognitoJwtVerifier.create({
  userPoolId: process?.env?.USER_POOL_ID ?? "",
  tokenUse: "access",
  clientId: process?.env?.USER_POOL_CLIENT_ID ?? "",
});

/**
 * Lambda Authorizer関数
 *
 * @param event API Gatewayからの認証イベント
 * @returns 認証結果（許可/拒否）
 */
export const handler = async (event: APIGatewayProxyEventV2) => {
  try {
    console.log("Authorizer called with event:", event);

    // Authorizationヘッダーからトークンを取得
    const token = event.headers.authorization;
    console.log("Raw token:", token);

    if (!token) {
      console.log("ERROR: Authorization token is missing");
      return {
        isAuthorized: false,
      };
    }

    // Bearerトークンの形式をチェック
    if (!token.startsWith("Bearer ")) {
      console.log("ERROR: Invalid token format. Expected Bearer token");
      return {
        isAuthorized: false,
      };
    }

    // Bearerプレフィックスを除去してJWTトークンを取得
    const jwtToken = token.substring(7);
    console.log("JWT token length:", jwtToken.length);

    // JWTトークンを検証
    const payload = await verifier.verify(jwtToken);

    console.log("Token verified successfully:", {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
    });

    // 認証成功時のレスポンスを返却
    const result = {
      isAuthorized: true,
      context: {
        userId: String(payload.sub),
        email: String(payload.email || ""),
        name: String(payload.name || ""),
      },
    };

    console.log("Authorizer result:", result);
    return result;
  } catch (error) {
    console.log("=== Authorizer Error ===");
    console.error("Authorization failed:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));

    // 認証失敗時は拒否レスポンスを返却
    return {
      isAuthorized: false,
    };
  }
};
