import Head from "next/head";
import DashboardLayout from "@/components/DashboardLayout";

export default function DocumentationPage() {
  return (
    <DashboardLayout>
      <Head>
        <title>Documentation - ctScreener</title>
        <meta name="description" content="How to use ctScreener tools like Coin Analyst and X Watcher, and explore the available API endpoints." />
      </Head>
<div className="text-white px-4 py-8">
  <h1 className="
    text-5xl font-extrabold mb-2
    bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-500
    bg-clip-text text-transparent
    drop-shadow-[0_2px_10px_rgba(96,165,250,0.3)]
  ">
    Documentation
  </h1>
  <p className="text-lg text-blue-100/80 italic max-w-lg mb-6">
    Learn how to use ctScreener's modules and access its scanning API endpoints.
  </p>

<div className="max-w-3xl space-y-10">
  {/* Coin Analyst */}
  <section className="bg-white/5 border border-blue-400/20 backdrop-blur-lg shadow-xl rounded-2xl p-6">
    <h2 className="text-2xl font-semibold mb-2">🧠 Coin Analyst</h2>
    <p className="text-gray-300">
      The Coin Analyst module helps you analyze who mentioned a token first — and who is currently shilling it.
    </p>
    <ul className="list-disc list-inside text-gray-400 mt-3 space-y-1">
      <li>Enter a Solana token address to start scanning</li>
      <li>Choose between <strong>Earliest Callers</strong> and <strong>Top Shillers</strong> mode</li>
      <li>Supports 24h and 7d shiller windows</li>
      <li>Displays tweet metrics (retweets, likes, views, time)</li>
      <li>Includes a token summary card (logo, name, symbol, dexscreener link)</li>
    </ul>
  </section>

  {/* High Impact Caller */}
  <section className="bg-white/5 border border-blue-400/20 backdrop-blur-lg shadow-xl rounded-2xl p-6">
    <h2 className="text-2xl font-semibold mb-2">📈 High Impact Caller</h2>
    <p className="text-gray-300">
      This module analyzes influencers who actually move markets by correlating their tweets with on-chain activity.
    </p>
    <ul className="list-disc list-inside text-gray-400 mt-3 space-y-1">
      <li>Select a token and choose date range (24h, 7d, or custom ≤10d)</li>
      <li>Identify tweets that triggered strong reactions (volume, buys)</li>
      <li>Uncover high-impact KOLs even if they tweet infrequently</li>
      <li>Supports dynamic window-based search and tweet sorting</li>
      <li>Includes token metadata and tweet view toggle</li>
    </ul>
  </section>

  {/* Developer API */}
  <section className="bg-white/5 border border-blue-400/20 backdrop-blur-lg shadow-xl rounded-2xl p-6">
    <h2 className="text-2xl font-semibold mb-2">🛠️ Developer API</h2>
    <p className="text-gray-300">
      Use our API to programmatically access ctScreener scan results and integrate with your own tools.
    </p>
    <ul className="list-disc list-inside text-gray-400 mt-3 space-y-1">
      <li>REST endpoints to scan tweets, retweeters, user timelines, and fetch profiles</li>
      <li>All APIs require wallet-authenticated JWT tokens (API Key)</li>
      <li>Supports filtering by screen name, tweet ID, keyword, and date</li>
      <li>Quota-based access with usage dashboard under "API Key" tab</li>
      <li>Webhook and alert integrations coming soon</li>
    </ul>
    <p className="text-sm text-gray-500 mt-3">
      🔓 These APIs are now in public beta. Holding <strong>10,000 $ctS</strong> grants access with <strong>10,000 monthly requests</strong>.</p>
  </section>
</div>
</div>

    </DashboardLayout>
  );
}
