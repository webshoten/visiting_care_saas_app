"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthPage } from "@/components/auth";
import { useAuth } from "@/contexts/AuthContext";

export default function SignInPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 既に認証済みの場合はホームページにリダイレクト
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        router.push("/");
      }
    };
    checkAuth();
  }, [isAuthenticated, router]);

  const handleAuthSuccess = () => {
    // 認証成功時にホームページにリダイレクト
    router.push("/");
  };

  return <AuthPage onSuccess={handleAuthSuccess} />;
}
