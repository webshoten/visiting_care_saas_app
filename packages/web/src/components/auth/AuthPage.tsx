/**
 * 認証ページコンポーネント
 *
 * 機能:
 * - サインイン、サインアップ、認証コード確認の画面切り替え
 * - 認証フローの状態管理
 * - 各認証フォームの統合と連携
 *
 * @param onSuccess 認証成功時のコールバック関数
 */

"use client";

// React関連のインポート
import type React from "react";
import { useState } from "react";
import { ConfirmCodeForm } from "./ConfirmCodeForm";
// 認証関連のコンポーネントをインポート
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

/**
 * 認証モードの型定義
 * 現在表示する認証画面の種類を管理
 */
type AuthMode = "signin" | "signup" | "confirm";

/**
 * AuthPageのプロパティ型定義
 */
interface AuthPageProps {
  onSuccess?: () => void; // 認証成功時のコールバック
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  // 現在の認証モード（サインイン/サインアップ/認証コード確認）
  const [mode, setMode] = useState<AuthMode>("signin");
  // 認証コード確認用のメールアドレス（サインアップから認証コード確認に遷移する際に使用）
  const [pendingEmail, setPendingEmail] = useState<string>("");

  /**
   * サインアップ画面に切り替えるハンドラー
   */
  const handleSwitchToSignUp = () => {
    setMode("signup");
  };

  /**
   * サインイン画面に切り替えるハンドラー
   */
  const handleSwitchToSignIn = () => {
    setMode("signin");
  };

  /**
   * 認証コード確認画面に切り替えるハンドラー
   * サインアップ完了時に呼び出される
   *
   * @param email 認証コードを送信したメールアドレス
   */
  const handleSwitchToConfirm = (email: string) => {
    setPendingEmail(email);
    setMode("confirm");
  };

  /**
   * 認証コード確認画面からサインアップ画面に戻るハンドラー
   */
  const handleBackToSignUp = () => {
    setMode("signup");
  };

  /**
   * 認証コード確認完了時のハンドラー
   * サインインフォームに遷移し、成功メッセージを表示
   */
  const handleConfirmSuccess = () => {
    // 認証コード確認完了後、サインインフォームに遷移
    setMode("signin");
    // 成功メッセージを表示するためのコールバック
    onSuccess?.();
  };

  /**
   * サインイン成功時のハンドラー
   * pendingEmailをクリアして成功コールバックを実行
   */
  const handleSuccess = () => {
    // サインイン成功後、pendingEmailをクリア
    setPendingEmail("");
    onSuccess?.();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {mode === "signin" ? (
          <SignInForm
            onSuccess={handleSuccess}
            onSwitchToSignUp={handleSwitchToSignUp}
            prefilledEmail={pendingEmail}
          />
        ) : mode === "signup" ? (
          <SignUpForm
            onSuccess={handleSuccess}
            onSwitchToSignIn={handleSwitchToSignIn}
            onSwitchToConfirm={handleSwitchToConfirm}
          />
        ) : (
          <ConfirmCodeForm
            email={pendingEmail}
            onSuccess={handleConfirmSuccess}
            onBack={handleBackToSignUp}
          />
        )}
      </div>
    </div>
  );
};
