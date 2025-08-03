"use client";

import { useToken } from "@/contexts/TokenContext";

export default function ProfilePage() {
  const { token } = useToken();

  return (
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
              <p className="text-gray-600">{token ? "認証済み" : "未認証"}</p>
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                トークン情報
              </h2>
              <div className="bg-gray-100 p-3 rounded-md">
                <p className="text-sm text-gray-700 break-all">
                  {token
                    ? `${token.substring(0, 50)}...`
                    : "トークンがありません"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
