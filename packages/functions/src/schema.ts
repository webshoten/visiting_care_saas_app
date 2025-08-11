import SchemaBuilder from "@pothos/core";
import { docClient } from "@visiting_app/core/dynamo-db";
import type { UserType } from "@visiting_app/core/user";
import { User } from "@visiting_app/core/user";

// Pothos Builderの作成
export const builder = new SchemaBuilder({});

// GraphQL User型の定義
export const GraphQLUserType = builder.objectRef<UserType>("User").implement({
  fields: (t) => ({
    userId: t.exposeString("userId"),
    noteId: t.exposeString("noteId"),
    version: t.exposeString("version"),
  }),
});

// Query型の定義
builder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: async () =>
        `Hello from Pothos!DynamoDB data is ${JSON.stringify(await User.getUser(docClient, { userId: "1" }))}`,
    }),
    user: t.field({
      type: GraphQLUserType,
      args: {
        userId: t.arg.string({ required: true }),
      },
      resolve: async (_, { userId }) => {
        const users = await User.getUser(docClient, { userId });
        return users[0];
      },
    }),
  }),
});

// スキーマをエクスポート
export const schema = builder.toSchema();
