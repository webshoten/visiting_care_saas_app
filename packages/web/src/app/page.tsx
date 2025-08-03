import { Resource } from "sst";
import { AuthPage, AuthStatus, UserProfile } from "@/components/auth";

export default async function Home() {
  const data = await fetch(Resource.MyApi.url);
  const apiResponse = await data.text();

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
            <AuthStatus />
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
              <pre className="text-sm text-gray-700">{apiResponse}</pre>
            </div>
          </div>

          {/* 認証コンポーネント */}
          <div>
            <h2 className="text-xl font-semibold mb-4">認証</h2>
            <AuthPage />
          </div>

          {/* ユーザープロフィール */}
          <div>
            <h2 className="text-xl font-semibold mb-4">ユーザープロフィール</h2>
            <UserProfile />
          </div>
        </div>
      </div>
    </div>
  );
}
