/**
 * Next.js Middleware for Authentication
 *
 * 機能:
 * - JWTトークンの検証
 * - 認証不要ページの除外
 * - 未認証ユーザーのリダイレクト
 */

import { type NextRequest, NextResponse } from "next/server";

/**
 * 認証不要のパスかどうかを判定する関数
 *
 * @param pathname パス名
 * @returns 認証不要の場合はtrue
 */
const isPublicPath = (pathname: string): boolean => {
  const publicPaths = [
    "/",
    "/signin",
    "/signup",
    "/confirm",
    "/api/auth/signin",
    "/api/auth/signup",
    "/api/auth/confirm",
    "/api/auth/refresh",
  ];

  return publicPaths.some((path) => pathname.startsWith(path));
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

  // リフレッシュトークンをクッキーから取得
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    // リフレッシュトークンがない場合はサインインページにリダイレクト
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // リフレッシュトークンの有効期限をチェック（簡易的な検証）
  try {
    const payload = JSON.parse(atob(refreshToken.split(".")[1]));
    const expirationTime = payload.exp * 1000; // ミリ秒に変換

    if (Date.now() >= expirationTime) {
      // リフレッシュトークンが期限切れの場合はサインインページにリダイレクト
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  } catch {
    // トークンの解析に失敗した場合はサインインページにリダイレクト
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
