/// pages/index.jsx
import Head from "next/head";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { NonBinary } from "lucide-react";

export default function LandingPage() {
  return (
    <DashboardLayout>
      <Head>
        <title>ctScreener - Your Crypto Twitter Intelligence Engine</title>
        <meta
          name="description"
          content="Detect early callers, track top shillers, and analyze high-impact influencers — all in one place."
        />
      </Head>

      <div className="text-white px-4 py-12 max-w-6xl mx-auto">
        {/* ==== Title & Tagline ==== */}
        <h1
          className="text-5xl sm:text-6xl font-extrabold mb-4
            bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-500
            bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(96,165,250,0.3)]"
        >
          ctScreener
        </h1>
        <p className="text-lg sm:text-xl text-blue-100/80 italic mb-12 max-w-2xl animate-fadeInSlow">
    The Crypto Twitter Intelligence Engine — detect early callers, track top shillers, and analyze high-impact influencers — all in one place.
        </p>

        {/* ==== Features Grid ==== */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
  {/* Feature: Coin Analyst */}
  <div className="bg-white/5 border border-blue-400/20 rounded-xl p-6 backdrop-blur-md shadow-md hover:shadow-xl transition min-h-[340px] flex flex-col justify-between">
    <div>
      <h3 className="text-2xl font-semibold text-blue-300 mb-2">🧠 Coin Analyst</h3>
      <p className="text-sm text-blue-100/90">
        Discover who called it first — and who’s shilling it now.<br /><br />
        Coin Analyst shows you the earliest callers and top shillers for any token across 24h or 7d windows, with rich summary insights.
      </p>
    </div>
    <Link
      href="/analyst"
      className="mt-6 block w-full text-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-br from-blue-500 to-cyan-400 rounded-md hover:from-blue-600 hover:to-cyan-500 transition"
    >
      ➤ Try Coin Analyst
    </Link>
  </div>

  {/* Feature: High Impact Caller */}
  <div className="bg-white/5 border border-blue-400/20 rounded-xl p-6 backdrop-blur-md shadow-md hover:shadow-xl transition min-h-[340px] flex flex-col justify-between">
    <div>
      <h3 className="text-2xl font-semibold text-blue-300 mb-2">📈 High Impact Caller</h3>
      <p className="text-sm text-blue-100/90">
        Go beyond likes and retweets.<br /><br />
        By combining on-chain transactions with Twitter activity, High Impact Caller reveals which influencers truly move markets — filterable by date and impact level.
      </p>
    </div>
    <Link
      href="/high-impact"
      className="mt-6 block w-full text-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-br from-blue-500 to-cyan-400 rounded-md hover:from-blue-600 hover:to-cyan-500 transition"
    >
      ➤ Explore High Impact
    </Link>
  </div>

  {/* Feature: Developer API */}
  <div className="bg-white/5 border border-blue-400/20 rounded-xl p-6 backdrop-blur-md shadow-md hover:shadow-xl transition min-h-[340px] flex flex-col justify-between">
    <div>
      <h3 className="text-2xl font-semibold text-blue-300 mb-2">🛠️ Developer API</h3>
      <p className="text-sm text-blue-100/90">
        Build your own dashboards, bots, or alert systems.<br /><br />
        Our REST API gives you access to raw tweet data, shiller insights, and scan history — secured with simple API keys and built for automation.
      </p>
    </div>
    <Link
      href="/api-key"
      className="mt-6 block w-full text-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-br from-blue-500 to-cyan-400 rounded-md hover:from-blue-600 hover:to-cyan-500 transition"
    >
      ➤ View Developer API
    </Link>
  </div>
</div>

        {/* ==== Action Button ==== */}
        <div className="flex flex-wrap gap-4">
          <Link
            href="/analyst"
            className="px-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-br from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 transition-all shadow-md"
          >
            🚀 Launch Coin Analyst
          </Link>
          <Link
            href="/docs"
            className="px-6 py-3 rounded-lg text-blue-100 font-medium border border-blue-400/40 hover:bg-blue-400/10 backdrop-blur-md transition"
          >
            📘 Read Docs
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
