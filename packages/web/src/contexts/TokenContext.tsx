/**
 * トークン管理用のコンテキスト
 *
 * 機能:
 * - 認証状態の管理
 * - トークン取得APIの呼び出し
 * - 認証状態の永続化
 */

'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

/**
 * トークンコンテキストの型定義
 */
interface TokenContextType {
  isAuthenticated: boolean;
  loading: boolean;
  getToken: () => Promise<string | null>;
  clearAuth: () => void;
  checkAuth: () => Promise<boolean>;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

/**
 * トークンプロバイダーコンポーネント
 *
 * @param children 子コンポーネント
 */
export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * 認証状態をチェックする関数
   */
  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/token', {
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(true);
        return true;
        // biome-ignore lint/style/noUselessElse: <explanation>
      } else {
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 初期化時に認証状態をチェック
    checkAuth();
  }, [checkAuth]);

  /**
   * アクセストークンを取得する関数
   */
  const getToken = async (): Promise<string | null> => {
    try {
      const response = await fetch('/api/auth/token', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        return data.accessToken;
      }
      setIsAuthenticated(false);
      return null;
    } catch (error) {
      console.error('Token retrieval failed:', error);
      setIsAuthenticated(false);
      return null;
    }
  };

  /**
   * 認証をクリアする関数
   */
  const clearAuth = async () => {
    try {
      // サインアウトAPIを呼び出してCookieをクリア
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Signout API error:', error);
    }

    setIsAuthenticated(false);
    // サインインページにリダイレクト
    window.location.href = '/signin';
  };

  return (
    <TokenContext.Provider
      value={{ isAuthenticated, loading, getToken, clearAuth, checkAuth }}
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
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};
