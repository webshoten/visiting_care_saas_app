/**
 * SST (Serverless Stack) 設定ファイル
 *
 * このファイルでは以下のリソースを定義しています：
 * - DynamoDB テーブル: ユーザーデータの保存
 * - Cognito User Pool: ユーザー認証システム
 * - API Gateway: REST API エンドポイント
 * - Next.js アプリケーション: フロントエンド
 */

/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  /**
   * アプリケーションの基本設定
   * @param input ステージ情報などの入力パラメータ
   * @returns アプリケーション設定オブジェクト
   */
  app(input) {
    return {
      name: "nextjsapp", // アプリケーション名
      removal: input?.stage === "production" ? "retain" : "remove", // 本番環境では削除保護
      protect: ["production"].includes(input?.stage), // 本番環境の保護設定
      home: "aws", // AWSをホームリージョンとして設定
    };
  },
  /**
   * メインのリソース定義関数
   * すべてのAWSリソースをここで定義します
   */
  async run() {
    /**
     * DynamoDB テーブル
     * ユーザーのノートデータを保存するためのテーブル
     *
     * スキーマ:
     * - userId: ユーザーID (パーティションキー)
     * - noteId: ノートID (ソートキー)
     */
    const table = new sst.aws.Dynamo("MyTable", {
      fields: {
        userId: "string", // ユーザーを識別するためのID
        noteId: "string", // ノートを識別するためのID
      },
      primaryIndex: { hashKey: "userId", rangeKey: "noteId" }, // 複合主キー
    });

    /**
     * Cognito User Pool
     * ユーザー認証システムの設定
     *
     * 機能:
     * - メールアドレスによるサインアップ/サインイン
     * - メール認証コードによるアカウント確認
     * - パスワードポリシーの設定
     * - アカウント復旧機能
     */
    const userPool = new sst.aws.CognitoUserPool("Auth", {
      transform: {
        userPool(args, opts, name) {
          // メールアドレスの自動検証を有効化
          args.autoVerifiedAttributes = ["email"];

          // ユーザー名としてメールアドレスを使用
          args.usernameAttributes = ["email"];
          args.usernameConfiguration = {
            caseSensitive: false, // メールの大文字小文字を区別しない
          };

          // アカウント復旧設定（メールによる復旧）
          args.accountRecoverySetting = {
            recoveryMechanisms: [{ name: "verified_email", priority: 1 }],
          };

          // メール送信設定（Cognitoのデフォルトサービスを使用）
          args.emailConfiguration = {
            emailSendingAccount: "COGNITO_DEFAULT",
          };

          // 管理者によるユーザー作成のみを無効化（ユーザー自身のサインアップを許可）
          args.adminCreateUserConfig = {
            allowAdminCreateUserOnly: false,
          };

          // パスワードポリシーの設定
          args.passwordPolicy = {
            minimumLength: 8, // 最小8文字
            requireLowercase: true, // 小文字必須
            requireNumbers: true, // 数字必須
            requireUppercase: true, // 大文字必須
            requireSymbols: false, // 記号は任意
            temporaryPasswordValidityDays: 7, // 仮パスワード有効期限7日
          };
        },
      },
    });

    /**
     * User Pool Client
     * フロントエンドアプリケーション用のクライアント設定
     */
    const userPoolClient = userPool.addClient("WebClient");

    /**
     * API Gateway
     * REST API エンドポイントの設定
     *
     * 機能:
     * - CORS設定（クロスオリジンリクエストの許可）
     * - DynamoDBテーブルとの連携
     * - Lambda関数との統合
     * - Cognito認証の統合
     */
    const api = new sst.aws.ApiGatewayV2("MyApi", {
      cors: {
        allowMethods: ["GET"], // 許可するHTTPメソッド
        allowOrigins: ["*"], // すべてのオリジンからのアクセスを許可
      },
      link: [table, userPool], // DynamoDBテーブルとUser Poolとの連携
    });

    /**
     * カスタムLambda Authorizer
     * Cognito認証を使用したAPI認証機能
     */
    const authorizer = api.addAuthorizer({
      name: "cognito",
      lambda: {
        function: {
          handler: "packages/functions/src/authorizer.handler",
          link: [userPool, userPoolClient], // User Poolとの連携
        },
        response: "simple", // シンプルレスポンス形式
      },
    });

    // APIルートの定義（認証付き）
    api.route("GET /", "packages/functions/src/api.handler", {
      auth: {
        lambda: authorizer.id,
      },
    });

    new sst.aws.Nextjs("MyWeb", {
      path: "packages/web", // Next.jsアプリケーションのパス
      environment: {
        // Cognito設定を環境変数として設定
        NEXT_PUBLIC_AUTH_USER_POOL_ID: userPool.id, // User Pool ID
        NEXT_PUBLIC_AUTH_USER_POOL_CLIENT_ID: userPoolClient.id, // Client ID
      },
      link: [api, userPool], // API GatewayとUser Poolとの連携
    });

    /**
     * リソースのエクスポート
     * 他のスタックや外部から参照可能なリソースを定義
     */
    return {
      MyApi: api, // API Gateway
      MyTable: table, // DynamoDBテーブル
      userPool: userPool, // Cognito User Pool
      userPoolClient: userPoolClient, // Cognito User Pool Client
    };
  },
});
