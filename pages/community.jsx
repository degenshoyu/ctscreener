import Head from "next/head";
import DashboardLayout from "@/components/DashboardLayout";

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
  <h1 className="
    text-5xl font-extrabold mb-2
    bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-500
    bg-clip-text text-transparent
    drop-shadow-[0_2px_10px_rgba(96,165,250,0.3)]
  ">
    Community
  </h1>
  <p className="text-lg text-blue-100/80 italic mb-6 max-w-2xl">
    We’re building the most powerful data platform for crypto Twitter. Join our community to shape what comes next — and help us spread the word about the <span className="text-yellow-400 font-semibold">$ctS</span> token.
  </p>

  <div className="grid gap-6 max-w-xl">
    <div className="
      bg-white/5 border border-blue-400/20
      backdrop-blur-lg shadow-xl rounded-2xl p-6
    ">
      <h2 className="text-xl font-semibold text-blue-400 mb-1">Telegram</h2>
      <a href="https://t.me/ctscreener" target="_blank" rel="noopener noreferrer" className="text-white underline">
        https://t.me/ctscreener
      </a>
    </div>

    <div className="
      bg-white/5 border border-blue-400/20
      backdrop-blur-lg shadow-xl rounded-2xl p-6
    ">
      <h2 className="text-xl font-semibold text-blue-400 mb-1">Twitter</h2>
      <a href="https://twitter.com/ctscreener" target="_blank" rel="noopener noreferrer" className="text-white underline">
        https://twitter.com/ctscreener
      </a>
    </div>

    <div className="
      bg-white/5 border border-blue-400/20
      backdrop-blur-lg shadow-xl rounded-2xl p-6
    ">
      <h2 className="text-xl font-semibold text-blue-400 mb-1">Twitter Community</h2>
      <a href="https://x.com/i/communities/1933756019555061941/" target="_blank" rel="noopener noreferrer" className="text-white underline">
        Join the X community now!
      </a>
    </div>
  </div>
</div>

    </DashboardLayout>
  );
}
