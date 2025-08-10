"use client";

import { useState } from "react";
import { useToken } from "@/contexts/TokenContext";

export default function Home() {
  const { getToken, isAuthenticated, loading } = useToken();
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const fetchApiData = async () => {
    setApiLoading(true);
    try {
      // REST APIエンドポイントを呼び出し
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log("API URL:", apiUrl);

      // トークンを取得
      const token = await getToken();
      if (!token) {
        setApiResponse({ error: "認証が必要です。再度ログインしてください。" });
        return;
      }

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApiResponse(data);
      } else {
        const errorText = await response.text();
        setApiResponse({
          error: `API Error: ${response.status} ${response.statusText}`,
          details: errorText,
          status: response.status,
          statusText: response.statusText,
        });
      }
    } catch (error) {
      console.error("API fetch error:", error);
      setApiResponse({
        error: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    } finally {
      setApiLoading(false);
    }
  };

  const handleCopyJson = async () => {
    if (!apiResponse) return;

    try {
      await navigator.clipboard.writeText(JSON.stringify(apiResponse, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("コピーに失敗しました:", error);
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
            <div
              className={`p-4 border rounded-md ${
                isAuthenticated
                  ? "bg-green-50 border-green-200"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <p className="text-gray-900">
                {loading
                  ? "認証状態を確認中..."
                  : isAuthenticated
                    ? "✅ 認証済み"
                    : "⚠️ 未認証"}
              </p>
            </div>
          </div>

          {/* API レスポンス表示 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <h2 className="text-xl font-semibold text-gray-900">
                API レスポンス
              </h2>
              {apiResponse && (
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  {copySuccess ? "✅ コピーしました！" : "📋 JSONをコピー"}
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={fetchApiData}
              disabled={apiLoading || !isAuthenticated}
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {apiLoading ? "⏳ 読み込み中..." : "🚀 APIを呼び出し"}
            </button>

            {apiResponse && (
              <div className="bg-gray-900 p-4 rounded-md overflow-auto max-h-96">
                <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            )}

            {!apiResponse && (
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-sm text-gray-700">
                  {!isAuthenticated
                    ? "APIを呼び出すには先に認証してください"
                    : "APIを呼び出すにはボタンをクリックしてください"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
