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

  <div className="max-w-xl space-y-10">
    <section className="
      bg-white/5 border border-blue-400/20
      backdrop-blur-lg shadow-xl rounded-2xl p-6
    ">
      <h2 className="text-2xl font-semibold mb-2">🪙 Coin Analyst (LIVE)</h2>
      <p className="text-gray-300">
        Coin Analyst helps you discover early mentions of Solana tokens on Twitter. Enter a token address to:
      </p>
      <ul className="list-disc list-inside text-gray-400 mt-2">
        <li>Fetch token metadata and price via Dexscreener</li>
        <li>Launch a Twitter scan to find earliest mentions</li>
        <li>View top tweets with metrics and timestamps</li>
      </ul>
    </section>

    <section className="
      bg-white/5 border border-blue-400/20
      backdrop-blur-lg shadow-xl rounded-2xl p-6
    ">
      <h2 className="text-2xl font-semibold mb-2">🔌 Twitter Scanner API (Alpha)</h2>
      <p className="text-gray-300 mb-2">
        Below are the available endpoints in alpha (not opened to the public):
      </p>
      <ul className="list-disc list-inside text-gray-400">
        <li><code>POST /search</code> — start scan using screen_name or keyword</li>
        <li><code>GET /job/:jobId</code> — retrieve scan results</li>
        <li><code>POST /tweet/by-id</code> — scan a single tweet by tweet_id</li>
        <li><code>POST /job/retweeters</code> — scan retweeters for a search job</li>
        <li><code>POST /job/retweeters/by-id</code> — scan retweeters for a single tweet</li>
        <li><code>POST /user/by-username</code> — fetch user profile data</li>
        <li><code>POST /user/timeline</code> — scan tweets from a user</li>
        <li><code>GET /logs?job_id=...</code> — retrieve logs for a job</li>
      </ul>
      <p className="text-sm text-gray-500 mt-2">
        These APIs will be opened to public testers during the beta launch.
      </p>
    </section>
  </div>
</div>

    </DashboardLayout>
  );
}
