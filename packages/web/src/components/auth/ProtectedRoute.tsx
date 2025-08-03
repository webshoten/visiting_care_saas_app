"use client";

import type React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthPage } from "./AuthPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
}) => {
  const { user, loading } = useAuth();

  // ローディング中はローディング表示
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">認証状態を確認中...</p>
        </div>
      </div>
    );
  }

  // 認証されていない場合は認証ページを表示
  if (!user) {
    return fallback || <AuthPage />;
  }

  // 認証されている場合は子コンポーネントを表示
  return <>{children}</>;
};
