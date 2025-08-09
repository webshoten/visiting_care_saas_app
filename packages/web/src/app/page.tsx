"use client";

import { useState } from "react";
import { useToken } from "@/contexts/TokenContext";

export default function Home() {
	const { getToken, isAuthenticated, loading } = useToken();
	const [apiResponse, setApiResponse] = useState<string>("");
	const [apiLoading, setApiLoading] = useState(false);

	const fetchApiData = async () => {
		setApiLoading(true);
		try {
			// 環境変数からAPIエンドポイントを取得
			const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
			console.log("API URL:", apiUrl); // デバッグ用

			// トークンを取得
			const token = await getToken();

			const response = await fetch(apiUrl, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Authorization Headerでトークン送信
				},
			});

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
			setApiLoading(false);
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
							<p className="text-gray-900">
								{isAuthenticated ? "認証済み" : "未認証"}
							</p>
						</div>
					</div>

					{/* API レスポンス表示 */}
					<div>
						<h2 className="text-xl font-semibold mb-4">API レスポンス</h2>
						<div className="bg-white p-4 rounded-lg shadow">
							<button
								type="button"
								onClick={fetchApiData}
								disabled={apiLoading}
								className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400"
							>
								{apiLoading ? "読み込み中..." : "APIを呼び出し"}
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
