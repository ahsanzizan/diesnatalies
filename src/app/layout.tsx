import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "./components/SessionProvider";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Deeznataleez",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-white text-black"}>
        <NextAuthProvider>
          <NextTopLoader color="#b52930" />
          <Toaster position="top-right" />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
