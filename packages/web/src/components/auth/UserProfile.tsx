"use client";

import type React from "react";
import { useAuth } from "@/contexts/AuthContext";

export const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            ようこそ、{user.name || user.username}さん
          </h2>
          <p className="text-gray-600 mt-1">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          サインアウト
        </button>
      </div>
    </div>
  );
};
