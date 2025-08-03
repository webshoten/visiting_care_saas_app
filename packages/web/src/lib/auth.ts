/**
 * 認証関連のユーティリティ関数 (auth.ts)
 *
 * このファイルでは以下の機能を提供します：
 * - AWS Cognito User Poolとの連携
 * - ユーザー認証（サインイン/サインアップ/サインアウト）
 * - 認証コード確認と再送信
 * - ユーザー情報の取得
 * - 認証状態の管理
 */

// AWS Cognito Identity JS ライブラリから必要なクラスをインポート
import {
  AuthenticationDetails, // 認証情報を管理するクラス
  CognitoUser, // Cognitoユーザーを表すクラス
  CognitoUserAttribute, // ユーザー属性を表すクラス
  CognitoUserPool, // User Poolを表すクラス
} from "amazon-cognito-identity-js";

/**
 * 認証ユーザーの型定義
 * アプリケーション内で使用するユーザー情報の構造を定義
 */
export interface AuthUser {
  username: string; // ユーザー名（メールアドレス）
  email: string; // メールアドレス
  name?: string; // 表示名（オプション）
  accessToken?: string; // アクセストークン（API呼び出し用）
}

/**
 * User Poolの初期化
 * シングルトンパターンでUser Poolインスタンスを管理
 */
let userPool: CognitoUserPool | null = null;

/**
 * User Poolを初期化する関数
 * 既に初期化済みの場合は既存のインスタンスを返す
 *
 * @returns Promise<CognitoUserPool> 初期化されたUser Poolインスタンス
 */
const initializeUserPool = async (): Promise<CognitoUserPool> => {
  // 既に初期化済みの場合は既存のインスタンスを返す
  if (userPool) return userPool;

  try {
    // SSTが自動生成する環境変数を使用してCognito設定を取得
    const cognitoConfig = {
      UserPoolId:
        process.env.NEXT_PUBLIC_AUTH_USER_POOL_ID ||
        process.env.NEXT_PUBLIC_AUTH_ID ||
        "dummy-user-pool-id",
      ClientId:
        process.env.NEXT_PUBLIC_AUTH_USER_POOL_CLIENT_ID ||
        process.env.NEXT_PUBLIC_AUTH_CLIENT_ID ||
        "dummy-client-id",
    };

    console.log("Cognito Config:", cognitoConfig); // デバッグ用
    console.log(
      "Available env vars:",
      Object.keys(process.env).filter((key) => key.includes("AUTH")),
    ); // デバッグ用

    // User Poolインスタンスを作成
    userPool = new CognitoUserPool(cognitoConfig);
    return userPool;
  } catch (error) {
    console.error("Failed to initialize User Pool:", error);
    throw new Error("User Pool initialization failed");
  }
};

/**
 * 現在のユーザーを取得する関数
 * ローカルストレージからユーザー情報を取得
 *
 * @returns Promise<CognitoUser | null> 現在のユーザー（未認証時はnull）
 */
export const getCurrentUser = async (): Promise<CognitoUser | null> => {
  const pool = await initializeUserPool();
  return pool.getCurrentUser();
};

/**
 * ユーザーが認証されているかチェックする関数
 * セッションの有効性を確認
 *
 * @returns Promise<boolean> 認証済みの場合true、未認証の場合false
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return false;
  }

  return new Promise((resolve) => {
    currentUser.getSession((err: any, session: any) => {
      if (err || !session?.isValid()) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

/**
 * ユーザーサインアップ関数
 * 新しいユーザーアカウントを作成し、メール認証を要求
 *
 * @param email メールアドレス（ユーザー名として使用）
 * @param password パスワード
 * @param name ユーザーの表示名
 * @returns Promise<any> サインアップ結果
 */
export const signUp = async (
  email: string,
  password: string,
  name: string,
): Promise<any> => {
  const pool = await initializeUserPool();

  console.log("SignUp attempt:", { email, name }); // デバッグログ

  return new Promise((resolve, reject) => {
    // ユーザー属性の設定
    const attributeList = [
      new CognitoUserAttribute({
        Name: "email",
        Value: email,
      }),
      new CognitoUserAttribute({
        Name: "name",
        Value: name,
      }),
    ];

    // Cognitoにサインアップを実行
    pool.signUp(email, password, attributeList, [], (err, result) => {
      if (err) {
        console.error("SignUp error:", err); // デバッグログ
        reject(err);
      } else {
        console.log("SignUp success:", result); // デバッグログ
        resolve(result);
      }
    });
  });
};

/**
 * ユーザーサインイン関数
 * メールアドレスとパスワードで認証を実行
 *
 * @param email メールアドレス（ユーザー名）
 * @param password パスワード
 * @returns Promise<any> サインイン結果
 */
export const signIn = async (email: string, password: string): Promise<any> => {
  const pool = await initializeUserPool();

  console.log("SignIn attempt:", { email }); // デバッグログ

  return new Promise((resolve, reject) => {
    // 認証情報の設定
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    // Cognitoユーザーオブジェクトの作成
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: pool,
    });

    // 認証を実行
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log("SignIn success:", result); // デバッグログ
        resolve(result);
      },
      onFailure: (err) => {
        console.error("SignIn error:", err); // デバッグログ
        reject(err);
      },
    });
  });
};

/**
 * ユーザーサインアウト関数
 * 現在のセッションを終了し、ローカルストレージをクリア
 *
 * @returns Promise<void>
 */
export const signOut = async (): Promise<void> => {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    currentUser.signOut();
  }
};

/**
 * 確認コードでサインアップを確認する関数
 * メールで送信された認証コードを検証してアカウントを有効化
 *
 * @param email メールアドレス（ユーザー名）
 * @param code 認証コード（6桁の数字）
 * @returns Promise<any> 確認結果
 */
export const confirmSignUp = async (
  email: string,
  code: string,
): Promise<any> => {
  const pool = await initializeUserPool();

  return new Promise((resolve, reject) => {
    // Cognitoユーザーオブジェクトの作成
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: pool,
    });

    // 認証コードで登録を確認
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * 確認コードを再送信する関数
 * 認証コードが届かない場合や期限切れの場合に再送信
 *
 * @param email メールアドレス（ユーザー名）
 * @returns Promise<any> 再送信結果
 */
export const resendConfirmationCode = async (email: string): Promise<any> => {
  const pool = await initializeUserPool();

  return new Promise((resolve, reject) => {
    // Cognitoユーザーオブジェクトの作成
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: pool,
    });

    // 確認コードを再送信
    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
