"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useToken } from "@/contexts/TokenContext";

export default function ProfilePage() {
  const { isAuthenticated, getToken } = useToken();
  const [tokenInfo, setTokenInfo] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleShowToken = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (token) {
        setTokenInfo(`${token.substring(0, 50)}...`);
      } else {
        setTokenInfo("トークンの取得に失敗しました");
      }
    } catch (error) {
      setTokenInfo("トークンの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              プロフィール
            </h1>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  認証状態
                </h2>
                <p className="text-gray-600">
                  {isAuthenticated ? "認証済み" : "未認証"}
                </p>
              </div>

              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  トークン情報
                </h2>
                <button
                  type="button"
                  onClick={handleShowToken}
                  disabled={loading || !isAuthenticated}
                  className="mb-3 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? "取得中..." : "トークンを表示"}
                </button>
                <div className="bg-gray-100 p-3 rounded-md">
                  <p className="text-sm text-gray-700 break-all">
                    {tokenInfo ||
                      "トークンを表示するにはボタンをクリックしてください"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
