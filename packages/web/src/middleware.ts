/**
 * Next.js Middleware for Authentication
 *
 * 機能:
 * - JWTトークンの検証
 * - 認証不要ページの除外
 * - 未認証ユーザーのリダイレクト
 */

import { CognitoJwtVerifier } from "aws-jwt-verify";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * 認証不要のパス
 */
const PUBLIC_PATHS = ["/signin"] as const;

/**
 * JWTトークンの検証器を初期化
 */
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.NEXT_PUBLIC_AUTH_USER_POOL_ID ?? "",
  tokenUse: "access",
  clientId: process.env.NEXT_PUBLIC_AUTH_USER_POOL_CLIENT_ID ?? "",
});

/**
 * パスが認証不要かどうかをチェック
 *
 * @param pathname パス名
 * @returns 認証不要の場合true
 */
const isPublicPath = (pathname: string): boolean => {
  return PUBLIC_PATHS.includes(pathname as any);
};

/**
 * トークンを検証する
 *
 * @param token JWTトークン
 * @returns 検証結果
 */
const verifyToken = async (token: string): Promise<boolean> => {
  try {
    await verifier.verify(token);
    return true;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
};

/**
 * Next.js Middleware関数
 *
 * @param request リクエストオブジェクト
 * @returns レスポンスまたは次の処理
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 認証不要ページはスキップ
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // クッキーからトークンを取得
  const cookies = request.cookies.getAll();
  const authTokenCookie = cookies.find((cookie) => cookie.name === "authToken");
  const token = authTokenCookie?.value;

  if (!token) {
    // トークンがない場合はサインインページにリダイレクト
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // トークンを検証
  const isValid = await verifyToken(token);

  if (!isValid) {
    // トークンが無効な場合はサインインページにリダイレクト
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 認証成功時は次の処理に進む
  return NextResponse.next();
}

/**
 * Middlewareの設定
 * APIルート、静的ファイル、画像ファイルは除外
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
