// packages/functions/src/api.ts

import { docClient } from "@visiting_app/core/dynamo-db";
import { Example } from "@visiting_app/core/example";
import { User } from "@visiting_app/core/user";
import type { Handler } from "aws-lambda";

export const handler: Handler = async (_event) => {
  console.log(_event);
  return {
    statusCode: 200,
    body: `${Example.hello()} : ${JSON.stringify(
      await User.getUser(docClient, {
        userId: "1",
      }),
    )}.`,
  };
};
