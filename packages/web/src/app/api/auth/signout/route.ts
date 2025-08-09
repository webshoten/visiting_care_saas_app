import { NextResponse } from "next/server";

export async function POST() {
  try {
    // レスポンスを作成
    const response = NextResponse.json({
      message: "サインアウトしました",
    });

    // アクセストークンCookieをクリア
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // 即座に期限切れ
    });

    // リフレッシュトークンCookieをクリア
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // 即座に期限切れ
    });

    return response;
  } catch (error) {
    console.error("Signout error:", error);
    return NextResponse.json(
      { message: "サインアウトに失敗しました" },
      { status: 500 },
    );
  }
}
