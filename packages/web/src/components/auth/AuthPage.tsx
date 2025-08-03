"use client";

import type React from "react";
import { useState } from "react";
import { ConfirmCodeForm } from "./ConfirmCodeForm";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

type AuthMode = "signin" | "signup" | "confirm";

interface AuthPageProps {
  onSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [pendingEmail, setPendingEmail] = useState<string>("");

  const handleSwitchToSignUp = () => {
    setMode("signup");
  };

  const handleSwitchToSignIn = () => {
    setMode("signin");
  };

  const handleSwitchToConfirm = (email: string) => {
    setPendingEmail(email);
    setMode("confirm");
  };

  const handleBackToSignUp = () => {
    setMode("signup");
  };

  const handleConfirmSuccess = () => {
    // 認証コード確認完了後、サインインフォームに遷移
    setMode("signin");
    // 成功メッセージを表示するためのコールバック
    onSuccess?.();
  };

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
