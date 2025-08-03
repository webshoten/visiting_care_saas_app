/**
 * ナビゲーションコンポーネント
 * 
 * 機能:
 * - 認証状態に応じたナビゲーション表示
 * - サインイン/サインアウト機能
 * - レスポンシブデザイン対応
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useToken } from "@/contexts/TokenContext";

/**
 * ナビゲーションコンポーネント
 */
export const Navigation: React.FC = () => {
  const { token, clearToken } = useToken();
  const router = useRouter();

  /**
   * サインアウト処理
   * トークンをクリアしてサインインページにリダイレクト
   */
  const handleSignOut = async () => {
    clearToken();
    router.push("/signin");
  };

  /**
   * 認証済みユーザー用のナビゲーションリンク
   */
  const AuthenticatedNav = () => (
    <>
      <Link
        href="/dashboard"
        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
      >
        ダッシュボード
      </Link>
      <Link
        href="/profile"
        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
      >
        プロフィール
      </Link>
      <button
        type="button"
        onClick={handleSignOut}
        className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        サインアウト
      </button>
    </>
  );

  /**
   * 未認証ユーザー用のナビゲーションリンク
   */
  const UnauthenticatedNav = () => (
    <Link
      href="/signin"
      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      サインイン
    </Link>
  );

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <Link href="/" className="text-xl font-bold text-gray-900">
            MyApp
          </Link>

          {/* ナビゲーションリンク */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              ホーム
            </Link>

            {token ? <AuthenticatedNav /> : <UnauthenticatedNav />}
          </div>
        </div>
      </div>
    </nav>
  );
};
