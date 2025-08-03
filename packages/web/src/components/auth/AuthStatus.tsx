"use client";

import type React from "react";
import { useAuth } from "@/contexts/AuthContext";

export const AuthStatus: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-blue-700">認証状態を確認中...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
        <p className="text-green-700">
          認証済み: {user.name || user.username} ({user.email})
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
      <p className="text-yellow-700">未認証</p>
    </div>
  );
};
