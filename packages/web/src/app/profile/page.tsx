"use client";

import type React from "react";
import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

const ProfileContent: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // ここでプロフィール更新のAPIを呼び出す
      await new Promise((resolve) => setTimeout(resolve, 1000)); // シミュレーション
      setMessage("プロフィールが正常に更新されました");
    } catch (error) {
      setMessage("プロフィールの更新に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              プロフィール設定
            </h1>
            <p className="text-gray-600">アカウント情報を編集できます</p>
          </div>

          {/* プロフィールフォーム */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              基本情報
            </h2>

            {message && (
              <div
                className={`mb-4 p-3 rounded ${
                  message.includes("成功")
                    ? "bg-green-100 border border-green-400 text-green-700"
                    : "bg-red-100 border border-red-400 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="山田太郎"
                />
              </div>

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
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  placeholder="example@email.com"
                />
                <p className="text-sm text-gray-500 mt-1">
                  メールアドレスの変更は現在サポートされていません
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "更新中..." : "プロフィールを更新"}
                </button>
              </div>
            </form>
          </div>

          {/* アカウント情報 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              アカウント情報
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">ユーザーID</span>
                <span className="font-mono text-sm">{user?.sub}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">アカウント作成日</span>
                <span>2024年1月1日</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">最終ログイン</span>
                <span>2024年1月15日 14:30</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
