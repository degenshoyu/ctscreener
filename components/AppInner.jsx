// components/AppInner.jsx

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { Toaster } from "@/components/ui/toaster";

const PRIVY_APP_ID = "cmbunw3nq009gjr0m3z2c1sfi";

const siteURL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NODE_ENV === "production"
    ? "https://www.ctscreener.xyz"
    : "http://localhost:3001";

const connectors = toSolanaWalletConnectors({
  metadata: {
    name: "ctScreener",
    description: "Crypto Twitter Screener",
    url: siteURL,
    icons: ["https://www.ctscreener.xyz/icon.png"],
  },
});

export default function AppInner({ Component, pageProps }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ["wallet", "email"],
        appearance: {
          theme: "dark",
          accentColor: "#6366F1",
          walletChainType: "solana-only",
          walletList: ["phantom", "solflare", "backpack", "detected_solana_wallets"],
        },
        externalWallets: {
          solana: {
            connectors,
          },
        },
      }}
    >
      <Component {...pageProps} />
      <Toaster />
    </PrivyProvider>
  );
}
