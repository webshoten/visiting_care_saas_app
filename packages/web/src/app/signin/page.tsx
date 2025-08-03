"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { AuthPage } from "@/components/auth";
import { useToken } from "@/contexts/TokenContext";

export default function SignInPage() {
	const { token } = useToken();
	const router = useRouter();
	const hasRedirected = useRef(false);

	useEffect(() => {
		// 既に認証済みの場合はホームページにリダイレクト
		if (token && !hasRedirected.current) {
			hasRedirected.current = true;
			router.push("/");
		}
	}, [token, router]);

	const handleAuthSuccess = () => {
		// 認証成功時にホームページにリダイレクト
		if (!hasRedirected.current) {
			hasRedirected.current = true;
			router.push("/");
		}
	};

	return <AuthPage onSuccess={handleAuthSuccess} />;
}
