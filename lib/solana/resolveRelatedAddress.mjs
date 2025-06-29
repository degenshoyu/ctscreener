// utils/resolveRelatedAddress.mjs

import { Connection, PublicKey } from "@solana/web3.js";
import * as borsh from "@project-serum/borsh";

// --- Use provided API key from environment ---
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const connection = new Connection(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`);

// --- Known DEX Program IDs ---
const PROGRAM_IDS = {
  raydium: "RVKd61ztZW9doMjTtzZ6xkbYdTLw9jNRkNUiKaJ4NBk",
  pumpswap: "pumpp9XiDs4qiXxyPbv9n74c7Rk4PDAZVytXyiPnUck",
  meteora: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo",
};

// --- Pool Layouts ---
const RAYDIUM_LAYOUT = borsh.struct([
  borsh.publicKey("ammAuthority"),
  borsh.publicKey("baseVault"),
  borsh.publicKey("quoteVault"),
]);

const PUMPSWAP_LAYOUT = borsh.struct([
  borsh.publicKey("bondingAuthority"),
  borsh.publicKey("baseVault"),
  borsh.publicKey("quoteVault"),
]);

const METEORA_LAYOUT = borsh.struct([
  borsh.publicKey("poolAuthority"),
  borsh.publicKey("tokenVaultA"),
  borsh.publicKey("tokenVaultB"),
]);

// --- Parsers ---
async function parseLayout(poolAddress, layout) {
  const info = await connection.getAccountInfo(new PublicKey(poolAddress));
  if (!info) throw new Error("❌ Pool state not found");
  return layout.decode(info.data);
}

const parseMap = {
  raydium: async (addr) => {
    const decoded = await parseLayout(addr, RAYDIUM_LAYOUT);
    return {
      programId: PROGRAM_IDS.raydium,
      authority: decoded.ammAuthority.toBase58(),
      vaultA: decoded.baseVault.toBase58(),
      vaultB: decoded.quoteVault.toBase58(),
    };
  },
  pumpswap: async (addr) => {
    const decoded = await parseLayout(addr, PUMPSWAP_LAYOUT);
    return {
      programId: PROGRAM_IDS.pumpswap,
      authority: decoded.bondingAuthority.toBase58(),
      vaultA: decoded.baseVault.toBase58(),
      vaultB: decoded.quoteVault.toBase58(),
    };
  },
  meteora: async (addr) => {
    const decoded = await parseLayout(addr, METEORA_LAYOUT);
    return {
      programId: PROGRAM_IDS.meteora,
      authority: decoded.poolAuthority.toBase58(),
      vaultA: decoded.tokenVaultA.toBase58(),
      vaultB: decoded.tokenVaultB.toBase58(),
    };
  },
};

// --- Main Export ---
export async function resolveRelatedAddress(tokenMint) {
  const url = `https://api.dexscreener.com/token-pairs/v1/solana/${tokenMint}`;
  const res = await fetch(url);
  const raw = await res.json();
  const pairs = Array.isArray(raw) ? raw : (raw.pairs ?? []);

  const TARGET_DEX = ["raydium", "pumpswap", "meteora"];
  const trusted = pairs.filter((p) =>
    p?.dexId && TARGET_DEX.includes(p.dexId.toLowerCase())
  );

  trusted.sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0));
  if (!trusted[0]) throw new Error(`❌ No trusted pool found for ${tokenMint}`);

  const best = trusted[0];
  const dexId = best.dexId.toLowerCase();
  const extra = await parseMap[dexId](best.pairAddress);

  return {
    pairAddress: best.pairAddress,
    dexId,
    baseToken: best.baseToken,
    quoteToken: best.quoteToken,
    liquidity: best.liquidity,
    ...extra,
  };
}

