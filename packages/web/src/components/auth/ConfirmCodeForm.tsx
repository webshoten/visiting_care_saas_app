"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ConfirmCodeFormProps {
  email: string;
  onSuccess?: () => void;
  onBack?: () => void;
}

export const ConfirmCodeForm: React.FC<ConfirmCodeFormProps> = ({
  email,
  onSuccess,
  onBack,
}) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { confirmSignUp, resendConfirmationCode } = useAuth();
  const codeInputRef = useRef<HTMLInputElement>(null);

  // コンポーネントマウント時に自動フォーカス
  useEffect(() => {
    if (codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await confirmSignUp(email, code);
      setSuccess(
        "アカウントが正常に確認されました！サインインフォームに移動します...",
      );
      // 成功メッセージを表示してからサインインフォームに遷移
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "認証コードの確認に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setResendLoading(true);

    try {
      await resendConfirmationCode(email);
      setSuccess("認証コードを再送信しました。メールをご確認ください。");
    } catch (err: any) {
      setError(err.message || "認証コードの再送信に失敗しました");
    } finally {
      setResendLoading(false);
    }
  };

  // 数字のみ入力可能にする
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setCode(value);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">認証コード確認</h2>

      <p className="text-sm text-gray-600 text-center mb-6">
        {email} に送信された6桁の認証コードを入力してください
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            hidden={success !== ""}
            htmlFor="code"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            認証コード
          </label>
          <input
            ref={codeInputRef}
            type="text"
            id="code"
            name="code"
            value={code}
            hidden={success !== ""}
            onChange={handleCodeChange}
            required
            maxLength={6}
            pattern="[0-9]{6}"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
            placeholder="000000"
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        </div>

        <button
          type="submit"
          hidden={success !== ""}
          disabled={loading || code.length !== 6}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "確認中..." : "認証コードを確認"}
        </button>
      </form>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={handleResendCode}
          hidden={success !== ""}
          disabled={resendLoading}
          className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resendLoading ? "送信中..." : "認証コードを再送信"}
        </button>

        {onBack && (
          <button
            type="button"
            hidden={success !== ""}
            onClick={onBack}
            className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            戻る
          </button>
        )}
      </div>
    </div>
  );
};
