"use client";

import { useEffect, useState } from "react";
import { AuthStatus, UserProfile } from "@/components/auth";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
	const { user, isAuthenticated } = useAuth();
	const [apiResponse, setApiResponse] = useState<string>("");
	const [loading, setLoading] = useState(false);

	const fetchApiData = async () => {
		setLoading(true);
		try {
			// 認証状態をチェック
			const authenticated = await isAuthenticated();

			if (authenticated && user) {
				// 認証済みの場合、トークンを取得してAPIを呼び出し
				const token = user.accessToken; // アクセストークン

				// 環境変数からAPIエンドポイントを取得
				const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

				const response = await fetch(apiUrl, {
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				});

				if (response.ok) {
					const data = await response.text();
					setApiResponse(data);
				} else {
					setApiResponse(
						`API Error: ${response.status} ${response.statusText}`,
					);
				}
			} else {
				// 未認証の場合
				setApiResponse("認証が必要です");
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
						<AuthStatus />
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
