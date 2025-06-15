import { Connection, PublicKey } from "@solana/web3.js";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { wallet } = req.query;
  const mint = process.env.CTS_MINT_ADDRESS;
  const rpc = process.env.SOLANA_RPC;

  console.log('🔑 RPC     :', rpc);
  console.log('🔑 Mint    :', mint);
  console.log('🔑 Wallet  :', wallet);

  if (!wallet || !mint) {
    return res.status(400).json({ error: 'Missing wallet or mint' });
  }

  try {
    const conn = new Connection(rpc);
    // ✅ 换成这个方法
    const resp = await conn.getParsedTokenAccountsByOwner(
      new PublicKey(wallet),
      { mint: new PublicKey(mint) }
    );

    console.log('✅ Raw resp:', JSON.stringify(resp, null, 2));

    let balance = 0;
    for (const { pubkey, account } of resp.value) {
      const info = account?.data?.parsed?.info;
      const uiAmt = info?.tokenAmount?.uiAmountString;
      if (uiAmt) {
        console.log(`👉 ATA ${pubkey.toBase58()} → ${uiAmt}`);
        balance += parseFloat(uiAmt);
      }
    }

    console.log('✅ Total balance:', balance);
    return res.status(200).json({ balance });
  } catch (err) {
    console.error('❌ checkBalance error:', err);
    return res.status(500).json({ error: err.message });
  }
}

