/**
 * ナビゲーションコンポーネント
 *
 * 機能:
 * - 認証状態に応じたナビゲーション表示
 * - サインイン/サインアウト機能
 * - レスポンシブデザイン対応
 */

'use client';

import Link from 'next/link';
import { useToken } from '@/contexts/TokenContext';
import { SignInButton, SignOutButton } from './AuthButton';

/**
 * ナビゲーションコンポーネント
 */
export const Navigation: React.FC = () => {
  const { isAuthenticated, clearAuth } = useToken();

  /**
   * サインアウト処理
   * トークンをクリアしてサインインページにリダイレクト
   */
  const handleSignOut = async () => {
    clearAuth();
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
        href="/master"
        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
      >
        マスター
      </Link>
      <Link
        href="/profile"
        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
      >
        プロフィール
      </Link>
      <SignOutButton type="button" onClick={handleSignOut} size="sm">
        サインアウト
      </SignOutButton>
    </>
  );

  /**
   * 未認証ユーザー用のナビゲーションリンク
   */
  const UnauthenticatedNav = () => (
    <Link href="/signin" className="">
      <SignInButton type="button" size="sm">
        サインイン
      </SignInButton>
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

            {isAuthenticated ? <AuthenticatedNav /> : <UnauthenticatedNav />}
          </div>
        </div>
      </div>
    </nav>
  );
};
