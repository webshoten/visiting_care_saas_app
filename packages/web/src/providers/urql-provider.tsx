"use client";

import { authExchange } from "@urql/exchange-auth";
import { cacheExchange, createClient, fetchExchange, Provider } from "urql";
import { useToken } from "@/contexts/TokenContext";

function UrqlClient({ children }: { children: React.ReactNode }) {
  const { getToken } = useToken();

  const client = createClient({
    url: process.env.NEXT_PUBLIC_API_URL + "/graphql",
    exchanges: [
      cacheExchange,
      authExchange(async (utilities) => {
        const token = await getToken();

        return {
          addAuthToOperation(operation) {
            if (token) {
              return utilities.appendHeaders(operation, {
                Authorization: `Bearer ${token}`,
              });
            }
            return operation;
          },
          didAuthError(error) {
            return (
              error.graphQLErrors?.some(
                (e) => e.extensions?.code === "FORBIDDEN",
              ) ?? false
            );
          },
          async refreshAuth() {
            await getToken();
          },
        };
      }),
      fetchExchange,
    ],
  });

  return <Provider value={client}>{children}</Provider>;
}

export default UrqlClient;
