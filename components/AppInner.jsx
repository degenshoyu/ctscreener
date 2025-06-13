// components/AppInner.jsx
import { PrivyProvider } from "@privy-io/react-auth";

const PRIVY_APP_ID = "cmbunw3nq009gjr0m3z2c1sfi";

export default function AppInner({ Component, pageProps }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ["wallet", "email"],
        appearance: {
          theme: "light",
          accentColor: "#6366F1",
          walletList: ["phantom", "solflare", "backpack", "detected_solana_wallets"],
        },
        embeddedWallets: {
          solana: true,
        },
        walletConnectors: [
          {
            provider: "phantom",
            chains: ["solana"],
          },
        ],
      }}
    >
      <Component {...pageProps} />
    </PrivyProvider>
  );
}
