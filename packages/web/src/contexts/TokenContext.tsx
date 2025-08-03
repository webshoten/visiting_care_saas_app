/**
 * トークン管理用のコンテキスト
 *
 * 機能:
 * - JWTトークンの状態管理
 * - localStorageでのアクセストークン管理
 * - リフレッシュトークンによる自動更新
 * - 認証状態の永続化
 */

"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

/**
 * トークンコンテキストの型定義
 */
interface TokenContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
  refreshToken: () => Promise<boolean>;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

/**
 * トークンの有効期限をチェックする関数
 */
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000; // ミリ秒に変換
    return Date.now() >= expirationTime;
  } catch {
    return true; // パースエラーの場合は期限切れとみなす
  }
};

/**
 * トークンプロバイダーコンポーネント
 *
 * @param children 子コンポーネント
 */
export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    // 初期化時にlocalStorageからトークンを読み込み
    const savedToken = localStorage.getItem("authToken");
    if (savedToken && !isTokenExpired(savedToken)) {
      setTokenState(savedToken);
    } else if (savedToken) {
      // 期限切れの場合は削除
      localStorage.removeItem("authToken");
    }
  }, []);

  /**
   * リフレッシュトークンを使用してアクセストークンを更新
   */
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include", // リフレッシュトークンをCookieで送信
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.accessToken);
        return true;
      } else {
        // リフレッシュ失敗時はログアウト
        clearToken();
        return false;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearToken();
      return false;
    }
  };

  /**
   * トークンを設定する関数
   * localStorageに保存
   *
   * @param newToken 新しいトークン（nullの場合は削除）
   */
  const setToken = (newToken: string | null) => {
    if (newToken && isTokenExpired(newToken)) {
      // 期限切れの場合はクリア
      clearToken();
      return;
    }

    setTokenState(newToken);

    if (newToken) {
      // トークンをlocalStorageに保存
      localStorage.setItem("authToken", newToken);
    } else {
      // トークンを削除
      localStorage.removeItem("authToken");
    }
  };

  /**
   * トークンをクリアする関数
   * localStorageから削除
   */
  const clearToken = () => {
    setTokenState(null);
    localStorage.removeItem("authToken");
  };

  return (
    <TokenContext.Provider
      value={{ token, setToken, clearToken, refreshToken }}
    >
      {children}
    </TokenContext.Provider>
  );
};

/**
 * トークンコンテキストを使用するフック
 *
 * @returns トークンコンテキスト
 * @throws TokenProviderの外で使用した場合にエラー
 */
export const useToken = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
};
