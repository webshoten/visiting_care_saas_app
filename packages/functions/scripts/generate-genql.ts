// @genql/cliを使用してクエリと型を生成するスクリプト

import { spawn } from "child_process";
import { writeFileSync } from "fs";
import { lexicographicSortSchema, printSchema } from "graphql";
import { schema } from "../src/schema";

async function generateGenQL() {
  // スキーマを文字列として出力
  const schemaAsString = printSchema(lexicographicSortSchema(schema));

  // スキーマファイルを一時的に作成
  writeFileSync("./src/graphql/schema.graphql", schemaAsString);

  // @genql/cliを実行
  const genqlProcess = spawn(
    "npx",
    [
      "@genql/cli",
      "--output",
      "../types/src/generated/genql",
      "--schema",
      "./src/graphql/schema.graphql",
      "--esm",
    ],
    {
      cwd: process.cwd(),
      stdio: "inherit",
    },
  );

  return new Promise((resolve, reject) => {
    genqlProcess.on("close", (code) => {
      if (code === 0) {
        console.log("GenQL generation completed successfully!");
        resolve(true);
      } else {
        reject(new Error(`GenQL generation failed with code ${code}`));
      }
    });
  });
}

generateGenQL()
  .then(() => {
    console.log("GenQL queries and types generated successfully!");
  })
  .catch((error) => {
    console.error("Failed to generate GenQL:", error);
    process.exit(1);
  });
