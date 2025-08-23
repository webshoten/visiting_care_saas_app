'use client';

import { authExchange } from '@urql/exchange-auth';
import { cacheExchange, createClient, fetchExchange, Provider } from 'urql';
import { useToken } from '@/contexts/TokenContext';

export default function UrqlProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken } = useToken();

  const client = createClient({
    url: (process.env.NEXT_PUBLIC_API_URL as string) + '/graphql',
    exchanges: [
      cacheExchange,
      authExchange(async (utils) => {
        const token = await getToken();
        return {
          addAuthToOperation(operation) {
            if (!token) return operation;
            return utils.appendHeaders(operation, {
              Authorization: `Bearer ${token}`,
            });
          },
          didAuthError(error) {
            return (
              error.graphQLErrors?.some(
                (e: any) => e.extensions?.code === 'FORBIDDEN',
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
