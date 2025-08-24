'use client';

import { useState } from 'react';
import { useToken } from '@/contexts/TokenContext';
import { useTypedQuery } from '@/lib/genql-urql-bridge';

export default function Home() {
  const { isAuthenticated, loading } = useToken();
  const [copySuccess, setCopySuccess] = useState(false);
  const [{ data, fetching, error }] = useTypedQuery({
    query: {
      user: {
        __args: {
          userId: '1',
        },
        userId: true,
        noteId: true,
        version: true,
      },
    },
    pause: !isAuthenticated,
    requestPolicy: 'network-only',
  });

  const handleCopyJson = async () => {
    if (!data) return;

    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('コピーに失敗しました:', error);
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
                  ? 'bg-green-50 border-green-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <p className="text-gray-900">
                {loading
                  ? '認証状態を確認中...'
                  : isAuthenticated
                    ? '✅ 認証済み'
                    : '⚠️ 未認証'}
              </p>
            </div>
          </div>

          {/* GraphQL レスポンス表示 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <h2 className="text-xl font-semibold text-gray-900">
                GraphQL レスポンス
              </h2>
              {data && (
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  {copySuccess ? '✅ コピーしました！' : '📋 JSONをコピー'}
                </button>
              )}
            </div>

            {fetching && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">⏳ 読み込み中...</p>
              </div>
            )}

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 p-4 rounded-md">
                <p className="text-sm text-red-700">エラー: {error.message}</p>
              </div>
            )}

            {data && (
              <div className="bg-gray-900 p-4 rounded-md overflow-auto max-h-96">
                <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}

            {!data && !fetching && !error && (
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-sm text-gray-700">
                  {!isAuthenticated
                    ? 'GraphQLを呼び出すには先に認証してください'
                    : '認証後にGraphQLクエリが自動実行されます'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
