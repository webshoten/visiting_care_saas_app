// PothosのスキーマをGraphQLファイルに出力するスクリプト

import { writeFileSync } from "fs";
import { printSchema } from "graphql";
import { schema } from "../src/schema";

// GraphQL SDLに変換
const sdl = printSchema(schema);

// ファイルに出力
writeFileSync("./src/graphql/schema.graphql", sdl);

console.log("GraphQL schema generated successfully!");
