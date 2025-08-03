"use client";

import { useEffect, useState } from "react";
import { useToken } from "@/contexts/TokenContext";

export default function Home() {
  const { token, refreshToken } = useToken();
  const [apiResponse, setApiResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchApiData = async () => {
    setLoading(true);
    try {
      // 環境変数からAPIエンドポイントを取得
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
      console.log("API URL:", apiUrl); // デバッグ用

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Authorization Headerでトークン送信
        },
      });

      if (response.status === 401) {
        // トークン期限切れの場合、自動更新を試行
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // 更新成功時は再試行
          return fetchApiData();
        } else {
          // 更新失敗時はエラーメッセージを表示
          setApiResponse("認証が期限切れです。再度ログインしてください。");
          return;
        }
      }

      if (response.ok) {
        const data = await response.text();
        setApiResponse(data);
      } else {
        setApiResponse(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("API fetch error:", error);
      setApiResponse(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* ヘッダー */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Next.js + SST + Cognito アプリケーション
            </h1>
            <p className="text-gray-600">
              認証機能付きのWebアプリケーションです
            </p>
          </div>

          {/* 認証状態表示 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">認証状態</h2>
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-gray-900">{token ? "認証済み" : "未認証"}</p>
            </div>
          </div>

          {/* 保護されたページへの案内 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              保護されたページ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  ダッシュボード
                </h3>
                <p className="text-gray-600 mb-3">
                  認証が必要なダッシュボードページです
                </p>
                <a
                  href="/dashboard"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  ダッシュボードへ
                </a>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  プロフィール
                </h3>
                <p className="text-gray-600 mb-3">
                  認証が必要なプロフィール編集ページです
                </p>
                <a
                  href="/profile"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                >
                  プロフィールへ
                </a>
              </div>
            </div>
          </div>

          {/* API レスポンス表示 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">API レスポンス</h2>
            <div className="bg-white p-4 rounded-lg shadow">
              <button
                type="button"
                onClick={fetchApiData}
                disabled={loading}
                className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "読み込み中..." : "APIを呼び出し"}
              </button>
              {apiResponse && (
                <pre className="text-sm text-gray-700">{apiResponse}</pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
