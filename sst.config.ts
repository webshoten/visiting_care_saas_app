//sst.config.ts

/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "nextjsapp",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const table = new sst.aws.Dynamo("MyTable", {
      fields: {
        userId: "string",
        noteId: "string",
      },
      primaryIndex: { hashKey: "userId", rangeKey: "noteId" },
    });

    const api = new sst.aws.ApiGatewayV2("MyApi", {
      cors: {
        allowMethods: ["GET"],
        allowOrigins: ["*"],
      },
      link: [table],
    });

    api.route("GET /", "packages/functions/src/api.handler");

    new sst.aws.Nextjs("MyWeb", {
      path: "packages/web",
      link: [api],
    });

    return {
      MyApi: api,
      MyTable: table,
    };
  },
});