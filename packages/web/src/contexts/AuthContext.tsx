/**
 * 認証コンテキスト (AuthContext)
 *
 * このファイルでは以下の機能を提供します：
 * - ユーザー認証状態の管理
 * - サインイン/サインアップ/サインアウト機能
 * - 認証コード確認機能
 * - ユーザー情報の取得と管理
 */

"use client";

// React関連のインポート
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// 認証関連の関数をインポート
import {
  type AuthUser,
  confirmSignUp,
  getCurrentUser,
  isAuthenticated,
  resendConfirmationCode,
  signIn,
  signOut,
  signUp,
} from "@/lib/auth";

/**
 * 認証コンテキストの型定義
 * コンテキストが提供する機能とデータの型を定義
 */
interface AuthContextType {
  user: AuthUser | null; // 現在のユーザー情報（未認証時はnull）
  loading: boolean; // 認証状態の読み込み中フラグ
  signIn: (email: string, password: string) => Promise<any>; // サインイン機能
  signUp: (email: string, password: string, name: string) => Promise<any>; // サインアップ機能
  signOut: () => Promise<void>; // サインアウト機能
  isAuthenticated: () => Promise<boolean>; // 認証状態チェック
  confirmSignUp: (email: string, code: string) => Promise<any>; // 認証コード確認
  resendConfirmationCode: (email: string) => Promise<any>; // 認証コード再送信
}

/**
 * 認証コンテキストのインスタンス
 * コンテキストの初期値はundefined（プロバイダー外での使用を防ぐため）
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 認証コンテキストを使用するためのカスタムフック
 *
 * @returns AuthContextType 認証コンテキストの値
 * @throws Error プロバイダー外で使用された場合
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * AuthProviderのプロパティ型定義
 */
interface AuthProviderProps {
  children: React.ReactNode; // プロバイダーでラップする子コンポーネント
}

/**
 * 認証プロバイダーコンポーネント
 *
 * 機能:
 * - 認証状態の管理
 * - ユーザー情報の取得と更新
 * - 認証関連の操作（サインイン、サインアップ、サインアウトなど）
 *
 * @param children プロバイダーでラップする子コンポーネント
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // 現在のユーザー情報を管理する状態
  const [user, setUser] = useState<AuthUser | null>(null);
  // 認証状態の読み込み中フラグ
  const [loading, setLoading] = useState(true);

  /**
   * 認証状態をチェックし、ユーザー情報を取得する関数
   *
   * 処理内容:
   * 1. 現在の認証状態を確認
   * 2. 認証済みの場合、ユーザー情報とセッション情報を取得
   * 3. ユーザー属性（name等）を取得してユーザー状態を更新
   * 4. エラーハンドリングとローディング状態の管理
   */
  const checkAuthStatus = useCallback(async () => {
    try {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          // ユーザー情報を取得
          currentUser.getSession((err: any, session: any) => {
            if (!err && session?.isValid()) {
              // ユーザー属性を取得（name等のカスタム属性を含む）
              currentUser.getUserAttributes((err, attributes) => {
                if (!err && attributes) {
                  const nameAttr = attributes.find(
                    (attr) => attr.getName() === "name",
                  );
                  setUser({
                    username: currentUser.getUsername(),
                    email: currentUser.getUsername(), // この例ではemailをusernameとして使用
                    name: nameAttr ? nameAttr.getValue() : undefined,
                    accessToken: session.getAccessToken().getJwtToken(), // アクセストークン
                  });
                } else {
                  // 属性取得に失敗した場合のフォールバック
                  setUser({
                    username: currentUser.getUsername(),
                    email: currentUser.getUsername(),
                    accessToken: session.getAccessToken().getJwtToken(), // アクセストークン
                  });
                }
              });
            }
          });
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // コンポーネントマウント時に認証状態をチェック
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  /**
   * サインイン処理のハンドラー
   *
   * @param email メールアドレス
   * @param password パスワード
   * @returns サインイン結果
   */
  const handleSignIn = async (email: string, password: string) => {
    try {
      const result = await signIn(email, password);
      await checkAuthStatus(); // サインイン後に認証状態を更新
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * サインアップ処理のハンドラー
   *
   * @param email メールアドレス
   * @param password パスワード
   * @param name ユーザー名
   * @returns サインアップ結果
   */
  const handleSignUp = async (
    email: string,
    password: string,
    name: string,
  ) => {
    try {
      const result = await signUp(email, password, name);
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * サインアウト処理のハンドラー
   * ユーザー状態をクリアしてサインアウトを実行
   */
  const handleSignOut = async () => {
    await signOut();
    setUser(null); // ユーザー状態をクリア
  };

  /**
   * 認証コード確認処理のハンドラー
   *
   * @param email メールアドレス
   * @param code 認証コード
   * @returns 確認結果
   */
  const handleConfirmSignUp = async (email: string, code: string) => {
    try {
      const result = await confirmSignUp(email, code);
      await checkAuthStatus(); // 確認後に認証状態を更新
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * 認証コード再送信処理のハンドラー
   *
   * @param email メールアドレス
   * @returns 再送信結果
   */
  const handleResendConfirmationCode = async (email: string) => {
    try {
      const result = await resendConfirmationCode(email);
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * コンテキストに提供する値の設定
   * すべての認証関連の機能と状態をまとめて提供
   */
  const value: AuthContextType = {
    user, // 現在のユーザー情報
    loading, // 読み込み中フラグ
    signIn: handleSignIn, // サインイン機能
    signUp: handleSignUp, // サインアップ機能
    signOut: handleSignOut, // サインアウト機能
    isAuthenticated, // 認証状態チェック機能
    confirmSignUp: handleConfirmSignUp, // 認証コード確認機能
    resendConfirmationCode: handleResendConfirmationCode, // 認証コード再送信機能
  };

  /**
   * 認証コンテキストプロバイダーを返す
   * 子コンポーネントに認証機能を提供
   */
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
