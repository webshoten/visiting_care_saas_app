import type React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserProfile } from "@/components/auth/UserProfile";

const DashboardContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ダッシュボード
            </h1>
            <p className="text-gray-600">認証が必要な保護されたページです</p>
          </div>

          {/* ユーザープロフィール */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ユーザー情報
            </h2>
            <UserProfile />
          </div>

          {/* ダッシュボードコンテンツ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 統計カード */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">統計</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">総アクセス数</span>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">今月のアクセス</span>
                  <span className="font-semibold">567</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">アクティブユーザー</span>
                  <span className="font-semibold">89</span>
                </div>
              </div>
            </div>

            {/* 最近のアクティビティ */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                最近のアクティビティ
              </h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  • ログイン: 2024年1月15日 14:30
                </div>
                <div className="text-sm text-gray-600">
                  • プロフィール更新: 2024年1月14日 10:15
                </div>
                <div className="text-sm text-gray-600">
                  • パスワード変更: 2024年1月10日 16:45
                </div>
              </div>
            </div>

            {/* クイックアクション */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                クイックアクション
              </h3>
              <div className="space-y-2">
                <button
                  type="button"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  プロフィール編集
                </button>
                <button
                  type="button"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  設定
                </button>
                <button
                  type="button"
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  ヘルプ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
