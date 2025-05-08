import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import SessionProvider from "@/utils/SessionProvider";
import Providers from "@/Providers";
import { getServerSession } from "next-auth";
import React from 'react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Authentication - Electronics eCommerce",
  description: "Login and register for Electronics eCommerce platform",
};

export default async function FullPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  
  return (
    <html lang="en" data-theme="light">
      <body className={`${inter.className}`}>
        <SessionProvider session={session}>
          <Providers>
            {children}
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}