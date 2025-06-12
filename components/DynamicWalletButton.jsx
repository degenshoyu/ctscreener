// components/DynamicWalletButton.jsx
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletIcon } from "lucide-react";
import { useMemo } from "react";

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function DynamicWalletButton() {
  const { publicKey } = useWallet();

  const shortAddress = useMemo(() => {
    if (!publicKey) return null;
    const base58 = publicKey.toBase58();
    return `${base58.slice(0, 5)}...${base58.slice(-4)}`;
  }, [publicKey]);

  return (
    <WalletMultiButton className="wallet-adapter-button">
      {publicKey ? shortAddress : <WalletIcon className="h-5 w-5" />}
    </WalletMultiButton>
  );
}
