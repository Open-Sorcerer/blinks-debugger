import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletProvider from "@/context/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blinks Debugger",
  description: "Debug your blinks easily",
  icons: "/logo.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`px-5 md:px-10 ${inter.className}`}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
