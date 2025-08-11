import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/auth/Navigation";
import { TokenProvider } from "@/contexts/TokenContext";
import UrqlClient from "@/providers/urql-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js + SST + Cognito",
  description: "認証機能付きのWebアプリケーション",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <TokenProvider>
          <UrqlClient>
            <Navigation />
            {children}
          </UrqlClient>
        </TokenProvider>
      </body>
    </html>
  );
}
