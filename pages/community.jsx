import Head from "next/head";
import DashboardLayout from "@/components/DashboardLayout";
import Topbar from "@/components/Topbar";

export default function CommunityPage() {
  return (
    <DashboardLayout>
      <Head>
        <title>Community - ctScreener</title>
        <meta name="description" content="Join the ctScreener community on Telegram and Twitter." />
        <meta property="og:title" content="ctScreener - Community" />
        <meta property="og:description" content="Join our crypto Twitter community." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/cover.png" />
      </Head>
      <div className="text-white px-4 py-8">
        <Topbar />
        <h1 className="text-3xl font-bold mb-2">Community</h1>
        <p className="text-gray-400 mb-6 max-w-2xl">
          We’re building the most powerful data platform for crypto Twitter. Join our community to shape what comes next — and help us spread the word about the
          <span className="text-yellow-400 font-semibold"> $ctS</span> token. The more support we get, the more features we can unlock — and the more free access we’ll offer to our token holders.
        </p>

        <div className="grid gap-6 max-w-xl">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
            <h2 className="text-xl font-semibold text-blue-400 mb-1">Telegram</h2>
            <a href="https://t.me/ctscreener" target="_blank" rel="noopener noreferrer" className="text-white underline">
              https://t.me/ctscreener
            </a>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
            <h2 className="text-xl font-semibold text-blue-400 mb-1">Twitter</h2>
            <a href="https://twitter.com/ctscreener" target="_blank" rel="noopener noreferrer" className="text-white underline">
              https://twitter.com/ctscreener
            </a>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
            <h2 className="text-xl font-semibold text-blue-400 mb-1">Twitter Community</h2>
            <a href="https://twitter.com/i/communities/your-community-id" target="_blank" rel="noopener noreferrer" className="text-white underline">
              Join our Twitter Community
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
