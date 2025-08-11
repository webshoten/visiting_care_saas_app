"use client";

import { createClient } from "@visiting_app/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useToken } from "./TokenContext";

interface GenQLContextType {
  client: ReturnType<typeof createClient> | null;
  loading: boolean;
}

const GenQLContext = createContext<GenQLContextType>({
  client: null,
  loading: true,
});

export function GenQLProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isAuthenticated } = useToken();
  const [client, setClient] = useState<ReturnType<typeof createClient> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeClient = async () => {
      if (!isAuthenticated) {
        setClient(null);
        setLoading(false);
        return;
      }

      try {
        const token = await getToken();

        const genqlClient = createClient({
          url: process.env.NEXT_PUBLIC_API_URL + "/graphql",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setClient(genqlClient);
      } catch (error) {
        console.error("GenQLクライアントの初期化に失敗:", error);
        setClient(null);
      } finally {
        setLoading(false);
      }
    };

    initializeClient();
  }, [isAuthenticated, getToken]);

  return (
    <GenQLContext.Provider value={{ client, loading }}>
      {children}
    </GenQLContext.Provider>
  );
}

export function useGenQL() {
  const context = useContext(GenQLContext);
  if (context === undefined) {
    throw new Error("useGenQL must be used within a GenQLProvider");
  }
  return context;
}
