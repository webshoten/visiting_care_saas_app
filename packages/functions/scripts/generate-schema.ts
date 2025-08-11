// PothosのスキーマをGraphQLファイルに出力するスクリプト

import SchemaBuilder from "@pothos/core";
import { writeFileSync } from "fs";
import { printSchema } from "graphql";

// Pothos Builderの作成（api.tsと同じ設定）
const builder = new SchemaBuilder({});

// Query型の定義（api.tsと同じ）
builder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: () => "Hello from Pothos!",
    }),
  }),
});

// スキーマを取得
const schema = builder.toSchema();

// GraphQL SDLに変換
const sdl = printSchema(schema);

// ファイルに出力
writeFileSync("./src/graphql/schema.graphql", sdl);

console.log("GraphQL schema generated successfully!");
