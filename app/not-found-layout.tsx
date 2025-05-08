import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Page Not Found - Electronics eCommerce",
  description: "Sorry, the page you are looking for does not exist.",
};

export default function NotFoundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}