"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useToken } from "@/contexts/TokenContext";

export default function DashboardPage() {
  const { isAuthenticated } = useToken();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              ダッシュボード
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  認証状態
                </h2>
                <p className="text-gray-600">
                  {isAuthenticated ? "認証済み" : "未認証"}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  統計
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-600">総ユーザー数: 1,234</p>
                  <p className="text-gray-600">今日のアクセス: 567</p>
                  <p className="text-gray-600">今月のアクセス: 12,345</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  最近のアクティビティ
                </h2>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    2024-01-15 14:30 ログイン
                  </p>
                  <p className="text-sm text-gray-600">
                    2024-01-15 13:45 プロフィール更新
                  </p>
                  <p className="text-sm text-gray-600">
                    2024-01-15 12:20 API呼び出し
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
