import Head from "next/head";
import DashboardLayout from "@/components/DashboardLayout";
import Topbar from "@/components/Topbar";

export default function ApiKeyPage() {
  return (
    <DashboardLayout>
    <Head>
      <title>ctScreener - API Access</title>
      <meta name="description" content="Get access to our self-developed Twitter API." />
      <meta property="og:title" content="ctScreener" />
      <meta property="og:description" content="Get access to our self-developed Twitter API." />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/cover.png" />
    </Head>
      <div className="text-white px-4 py-8">
        <Topbar />
        <h1 className="text-3xl font-bold mb-2">API Key (coming soon...)</h1>
        <p className="text-gray-400 mb-6">
          Get access to our self-developed Twitter API — designed for developers.
        </p>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 max-w-2xl space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">
              🔐 Your API Key
            </h2>
            <div className="bg-gray-800 rounded-lg px-4 py-3 font-mono text-sm text-green-400 border border-gray-600">
              ctsk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            </div>
            <p className="text-sm text-yellow-400 mt-2">Coming soon – Key will be revealed after beta launch</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">
              📊 Usage Summary
            </h2>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-600 space-y-2">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Plan</span>
                <span>ctScreener Free Tier</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Monthly Quota</span>
                <span>10,000 requests</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Used</span>
                <span>—</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Next Reset</span>
                <span>—</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Minimum Holding</span>
                <span>10,000 $ctS</span>
              </div>
            </div>
          </div>

          <div>
            <p className="mt-3 text-yellow-300">🚧 API service is currently in alpha — powering <strong>Coin Analyst</strong> and <strong>X Watcher</strong>.</p>
            <p className="mt-3 text-yellow-300">🚀 Public beta access launching in <strong>30th June 2025</strong>. Stay tuned for early access opportunities.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
