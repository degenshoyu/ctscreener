import { Connection, PublicKey } from "@solana/web3.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { wallet } = req.query;
  const mint = process.env.CTS_MINT_ADDRESS;
  const rpcList = (process.env.SOLANA_RPCS || "")
    .split(",")
    .map((r) => r.trim());

  console.log("🔑 RPC List:", rpcList);
  console.log("🔑 Mint    :", mint);
  console.log("🔑 Wallet  :", wallet);

  if (!wallet || !mint || rpcList.length === 0) {
    return res.status(400).json({ error: "Missing wallet, mint, or RPCs" });
  }

  let lastError = null;

  for (const rpc of rpcList) {
    try {
      console.log(`🚀 Trying RPC: ${rpc}`);
      const conn = new Connection(rpc);

      const resp = await conn.getParsedTokenAccountsByOwner(
        new PublicKey(wallet),
        { mint: new PublicKey(mint) },
      );

      console.log("✅ Raw resp:", JSON.stringify(resp, null, 2));

      let balance = 0;
      for (const { pubkey, account } of resp.value) {
        const info = account?.data?.parsed?.info;
        const uiAmt = info?.tokenAmount?.uiAmountString;
        if (uiAmt) {
          console.log(`👉 ATA ${pubkey.toBase58()} → ${uiAmt}`);
          balance += parseFloat(uiAmt);
        }
      }

      console.log(`✅ Total balance [${rpc}]:`, balance);
      return res.status(200).json({ balance });
    } catch (err) {
      console.error(`❌ RPC failed: ${rpc}`, err);
      lastError = err;
    }
  }

  return res
    .status(500)
    .json({ error: lastError?.message || "All RPCs failed" });
}
