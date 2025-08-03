/**
 * サインアップフォームコンポーネント
 *
 * 機能:
 * - ユーザー登録フォームの表示とバリデーション
 * - サインアップ処理の実行
 * - 認証コード確認画面への遷移
 *
 * @param onSuccess サインアップ成功時のコールバック
 * @param onSwitchToSignIn サインイン画面への遷移コールバック
 * @param onSwitchToConfirm 認証コード確認画面への遷移コールバック
 */

"use client";

// React関連のインポート
import type React from "react";
import { useState } from "react";

// 認証関連のフックをインポート
import { useAuth } from "@/contexts/AuthContext";

/**
 * SignUpFormのプロパティ型定義
 */
interface SignUpFormProps {
  onSuccess?: () => void; // サインアップ成功時のコールバック
  onSwitchToSignIn?: () => void; // サインイン画面への遷移コールバック
  onSwitchToConfirm?: (email: string) => void; // 認証コード確認画面への遷移コールバック
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSuccess,
  onSwitchToSignIn,
  onSwitchToConfirm,
}) => {
  // フォームデータの状態管理
  const [formData, setFormData] = useState({
    email: "", // メールアドレス
    password: "", // パスワード
    confirmPassword: "", // パスワード確認
    name: "", // ユーザー名
  });

  // ローディング状態の管理
  const [loading, setLoading] = useState(false);
  // エラーメッセージの管理
  const [error, setError] = useState("");

  // 認証コンテキストからサインアップ関数を取得
  const { signUp } = useAuth();

  /**
   * フォーム入力値の変更を処理するハンドラー
   *
   * @param e 入力イベント
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * フォーム送信を処理するハンドラー
   *
   * 処理内容:
   * 1. フォームのデフォルト動作を防止
   * 2. バリデーション（パスワード一致、文字数チェック）
   * 3. サインアップ処理の実行
   * 4. 成功時は認証コード確認画面に遷移
   * 5. エラーハンドリングとローディング状態の管理
   *
   * @param e フォーム送信イベント
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // パスワード一致のバリデーション
    if (formData.password !== formData.confirmPassword) {
      setError("パスワードが一致しません");
      setLoading(false);
      return;
    }

    // パスワード文字数のバリデーション
    if (formData.password.length < 8) {
      setError("パスワードは8文字以上である必要があります");
      setLoading(false);
      return;
    }

    try {
      // サインアップ処理を実行
      await signUp(formData.email, formData.password, formData.name);

      // フォームデータをリセット
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
      });

      // 認証コード確認画面に遷移
      onSwitchToConfirm?.(formData.email);
    } catch (err: any) {
      setError(err.message || "サインアップに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  /**
   * サインアップフォームのレンダリング
   *
   * 表示内容:
   * - フォームヘッダー（アカウント作成）
   * - エラーメッセージ（エラーがある場合）
   * - 入力フィールド（名前、メール、パスワード、パスワード確認）
   * - 送信ボタン（ローディング状態対応）
   * - サインイン画面へのリンク
   */
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* フォームヘッダー */}
      <h2 className="text-2xl font-bold text-center mb-6">アカウント作成</h2>

      {/* エラーメッセージの表示 */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* サインアップフォーム */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 名前入力フィールド */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            名前
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="山田太郎"
          />
        </div>

        {/* メールアドレス入力フィールド */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="example@email.com"
          />
        </div>

        {/* パスワード入力フィールド */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            パスワード
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="8文字以上"
          />
        </div>

        {/* パスワード確認入力フィールド */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            パスワード確認
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="パスワードを再入力"
          />
        </div>

        {/* 送信ボタン（ローディング状態対応） */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "作成中..." : "アカウント作成"}
        </button>
      </form>

      {/* サインイン画面へのリンク */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          既にアカウントをお持ちですか？{" "}
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            サインイン
          </button>
        </p>
      </div>
    </div>
  );
};
