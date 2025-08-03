"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useAuth } from "@/contexts/AuthContext";

export const Navigation: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
  };

  // スケルトンコンポーネント
  const SkeletonButton = () => (
    <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse"></div>
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
            {loading ? (
              // ローディング中はスケルトンを表示
              <>
                <SkeletonButton />
                <SkeletonButton />
                <SkeletonButton />
                <SkeletonButton />
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  ホーム
                </Link>

                {user ? (
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
                ) : (
                  <Link
                    href="/signin"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    サインイン
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
