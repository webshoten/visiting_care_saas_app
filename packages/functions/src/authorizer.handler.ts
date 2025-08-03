export const handler = async (event: any) => {
  console.log("Authorizer called:", event);
  return {
    principalId: "test-user",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: event.methodArn,
        },
      ],
    },
  };
};
