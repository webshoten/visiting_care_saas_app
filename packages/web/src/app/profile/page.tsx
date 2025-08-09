"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useToken } from "@/contexts/TokenContext";

interface UserInfo {
  username: string;
  userAttributes: Record<string, string>;
  mfaOptions?: any[];
  preferredMfaSetting?: string;
  userMFASettingList?: string[];
}

export default function ProfilePage() {
  const { isAuthenticated, getToken } = useToken();
  const [tokenInfo, setTokenInfo] = useState<string>("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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

  const handleGetUserInfo = async () => {
    setUserLoading(true);
    try {
      const response = await fetch("/api/auth/user", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
      } else {
        console.error("ユーザー情報の取得に失敗しました");
      }
    } catch (error) {
      console.error("ユーザー情報の取得に失敗しました:", error);
    } finally {
      setUserLoading(false);
    }
  };

  const handleCopyJson = async () => {
    if (!userInfo) return;

    try {
      await navigator.clipboard.writeText(JSON.stringify(userInfo, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("コピーに失敗しました:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              プロフィール
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 認証状態 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    認証状態
                  </h2>
                  <p className="text-gray-600">
                    {isAuthenticated ? "認証済み" : "未認証"}
                  </p>
                </div>
              </div>

              {/* トークン情報 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
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

              {/* ユーザー情報 */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    ユーザー情報
                  </h2>
                  <button
                    type="button"
                    onClick={handleGetUserInfo}
                    disabled={userLoading || !isAuthenticated}
                    className="mb-4 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {userLoading ? "取得中..." : "ユーザー情報を取得"}
                  </button>

                  {userInfo && (
                    <div className="space-y-4">
                      {/* 基本情報 */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          基本情報
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-700">
                            <strong>ユーザー名:</strong> {userInfo.username}
                          </p>
                        </div>
                      </div>

                      {/* ユーザー属性 */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          ユーザー属性
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-md space-y-2">
                          {Object.entries(userInfo.userAttributes).map(
                            ([key, value]) => (
                              <p key={key} className="text-sm text-gray-700">
                                <strong>{key}:</strong> {value}
                              </p>
                            ),
                          )}
                        </div>
                      </div>

                      {/* MFA設定 */}
                      {(userInfo.mfaOptions ||
                        userInfo.preferredMfaSetting ||
                        userInfo.userMFASettingList) && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            MFA設定
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-md space-y-2">
                            {userInfo.preferredMfaSetting && (
                              <p className="text-sm text-gray-700">
                                <strong>優先MFA設定:</strong>{" "}
                                {userInfo.preferredMfaSetting}
                              </p>
                            )}
                            {userInfo.userMFASettingList &&
                              userInfo.userMFASettingList.length > 0 && (
                                <p className="text-sm text-gray-700">
                                  <strong>MFA設定リスト:</strong>{" "}
                                  {userInfo.userMFASettingList.join(", ")}
                                </p>
                              )}
                          </div>
                        </div>
                      )}

                      {/* 生のJSONレスポンス */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            APIレスポンス（JSON）
                          </h3>
                          <button
                            type="button"
                            onClick={handleCopyJson}
                            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                          >
                            {copySuccess ? "コピーしました！" : "JSONをコピー"}
                          </button>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-md overflow-auto max-h-96">
                          <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                            {JSON.stringify(userInfo, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {!userInfo && (
                    <div className="bg-gray-100 p-4 rounded-md">
                      <p className="text-sm text-gray-700">
                        ユーザー情報を取得するにはボタンをクリックしてください
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
