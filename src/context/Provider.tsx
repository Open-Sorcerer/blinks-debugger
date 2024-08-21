"use client";
import { UnifiedWalletProvider } from "@jup-ag/wallet-adapter";

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UnifiedWalletProvider
      wallets={[]}
      config={{
        autoConnect: true,
        env: "mainnet-beta",
        metadata: {
          name: "Blinks Debugger",
          description:
            "Blinks debugger is a tool for inspecting and interacting with Blinks.",
          url: "https://www.blinks.io",
          iconUrls: ["/next.svg"],
        },
        theme: "dark",
        lang: "en",
      }}
    >
      {children}
    </UnifiedWalletProvider>
  );
}
