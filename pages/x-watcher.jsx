import Head from "next/head";
import DashboardLayout from "@/components/DashboardLayout";
import Topbar from "@/components/Topbar";

export default function XWatcherPage() {
  return (
    <DashboardLayout>
      <Head>
        <title>X Watcher - ctScreener</title>
        <meta name="description" content="Real-time Twitter watcher. Get instant alerts when your favorite KOLs tweet." />
        <meta property="og:title" content="ctScreener - X Watcher" />
        <meta property="og:description" content="Real-time Twitter watcher." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/cover.png" />
      </Head>
      <div className="text-white px-4 py-8">
        <Topbar />
        <h1 className="text-3xl font-bold mb-2">X Watcher</h1>
        <p className="text-gray-400 mb-6">
          Real-time Twitter watcher. Get instant alerts when your favorite KOLs tweet.
        </p>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 max-w-2xl">
          <h2 className="text-xl font-semibold text-yellow-400 mb-3">
            X Watcher v0.1 (Alpha)
          </h2>
          <p className="mb-2">
            The Telegram bot is now live and free to use. Watch up to <strong>3 Twitter accounts</strong> with updates every <strong>30 seconds</strong>.
          </p>
          <p className="mb-2">
            👉 Find the bot here:{" "}
            <a
              href="https://t.me/proXWatcher_bot"
              className="text-blue-400 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://t.me/proXWatcher_bot
            </a>
          </p>
          <ul className="list-disc ml-6 mt-4 text-gray-300 space-y-1">
            <li>
              <code className="text-white font-mono">/watch @username</code> – Add a Twitter account to your watchlist
            </li>
            <li>
              <code className="text-white font-mono">/unwatch @username</code> – Remove from your watchlist
            </li>
            <li>
              <code className="text-white font-mono">/status</code> – View current watchlist
            </li>
          </ul>

          <p className="mt-6 text-sm text-gray-400">
            We are working on expanding watch slots and launching a premium version with 3–5 second latency + adding the bot to your Telegram group for group alerts.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
