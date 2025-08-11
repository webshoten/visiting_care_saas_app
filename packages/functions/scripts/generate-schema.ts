// PothosのスキーマをGraphQLファイルに出力するスクリプト

import { writeFileSync, mkdirSync } from "fs";
import { printSchema, lexicographicSortSchema } from "graphql";
import { dirname } from "path";
import { schema } from "../src/schema";

// スキーマを文字列として出力
const schemaAsString = printSchema(lexicographicSortSchema(schema));

// ディレクトリが存在しない場合は作成
const outputPath = "./src/graphql/schema.graphql";
const outputDir = dirname(outputPath);

try {
  mkdirSync(outputDir, { recursive: true });
} catch (error) {
  // ディレクトリが既に存在する場合は無視
}

// ファイルに出力
writeFileSync(outputPath, schemaAsString);

console.log("GraphQL schema generated successfully!");
