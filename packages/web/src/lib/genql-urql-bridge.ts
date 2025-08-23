// GenQL（selection から GraphQL Operation を生成）と
// urql（クライアント実行・キャッシュ）を橋渡しするためのユーティリティ。
// 方針:
// - フロント側では GenQL の selection で型安全にクエリ/ミューテーション内容を表現
// - 実行は urql の hook / client を用いて行い、urql のエコシステム（キャッシュ等）を活用
// - graphql-codegen は使わず、GenQL の生成物のみを依存対象にする
/**
 * GenQL selection と urql の橋渡し（Query/Mutation）。
 *
 * - Query:
 *   - GenQL が生成する型 `QueryGenqlSelection` で selection（取得フィールドと引数）を宣言
 *   - `generateQueryOp(selection)` で selection から `{ query, variables }` を生成
 *   - 生成された `query` と `variables` をそのまま urql `useQuery` に渡して実行（型安全 + urql のキャッシュ活用）
 *
 * - Mutation:
 *   - `generateMutationOp` で `{ query, variables }` を生成
 *   - 実行は `executeTypedMutation`（関数）で行う（フックは提供しない）
 *
 * - 方針:
 *   - graphql-codegen は使用せず、GenQL の生成物のみを依存対象とする
 *   - backend スキーマ変更は GenQL の再生成でフロントに自動反映（型/クエリ）
 */

import type {
    MutationGenqlSelection,
    MutationResult,
    QueryGenqlSelection,
    QueryResult,
} from "@visiting_app/types";
import { generateMutationOp, generateQueryOp } from "@visiting_app/types";
import type { OperationContext } from "urql";
import { createRequest, type useClient, useQuery } from "urql";

type RequestPolicy =
    | "cache-first"
    | "cache-only"
    | "network-only"
    | "cache-and-network";

// Note: 現状 executeTypedMutation は toPromise を使用していません

// useTypedQuery
// 役割: GenQL の selection（どのフィールドを取得し、どの引数を渡すか）から
// 実行可能な { query, variables } を生成し、そのまま urql の useQuery に渡す。
// 効果: selection による型安全と、urql のキャッシュ/ポリシーを同時に活用できる。
export function useTypedQuery<Query extends QueryGenqlSelection>(opts: {
    query: Query;
    pause?: boolean;
    requestPolicy?: RequestPolicy;
    context?: Partial<OperationContext>;
}) {
    const { query, variables } = generateQueryOp(opts.query);
    return useQuery<QueryResult<Query>>({
        ...opts,
        query,
        variables,
    });
}

// このモジュールでは Mutation の実行は関数 executeTypedMutation のみ提供する。

// executeTypedMutation
// 役割: フックを使わない（関数的な）単発実行ユーティリティ。
// 使い所: ハンドラ内で 1 回だけ実行したい場合など。
export function executeTypedMutation<Mutation extends MutationGenqlSelection>(
    client: ReturnType<typeof useClient>,
    mutation: Partial<Mutation>,
    opts?: Partial<OperationContext>,
) {
    const { query, variables } = generateMutationOp(mutation as Mutation);
    const request = createRequest<MutationResult<typeof mutation>>(
        query,
        variables,
    );
    return client.executeMutation(request, opts).toPromise();
}
