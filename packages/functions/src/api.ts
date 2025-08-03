// packages/functions/src/api.ts

import { Handler } from "aws-lambda";
import { Example } from "@visiting_app/core/example";
import { User } from "@visiting_app/core/user";
import { docClient } from "@visiting_app/core/dynamo-db";

export const handler: Handler = async (_event) => {
  console.log(_event);
  // DynamoDBのテーブル内容(userId=1)をそのまま返すだけ
  return {
    statusCode: 200,
    body: `${Example.hello()} : ${
      JSON.stringify(
        await User.getUser(docClient, {
          userId: "1",
        }),
      )
    }.`,
  };
};