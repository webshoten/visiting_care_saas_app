// packages/functions/src/api.ts

import { docClient } from "@visiting_app/core/dynamo-db";
import { Example } from "@visiting_app/core/example";
import { User } from "@visiting_app/core/user";
import type { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  console.log("API Handler called with event:", event);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "http://localhost:3000",
    },
    body: JSON.stringify({
      message: "API is working!",
      timestamp: new Date().toISOString(),
      example: Example.hello(),
      user: await User.getUser(docClient, { userId: "1" }),
    }),
  };
};
