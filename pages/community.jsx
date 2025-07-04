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

<div className="mt-12 space-y-10 max-w-xl">
  <section className="bg-white/5 border border-blue-400/20 backdrop-blur-lg shadow-xl rounded-2xl p-6">
    <h2 className="text-xl font-semibold text-blue-400 mb-3">🔗 Useful Links</h2>
    <ul className="list-disc list-inside text-blue-100/90 space-y-2">
      <li>
        🌐 Website:{" "}
        <a href="https://www.ctscreener.xyz" target="_blank" rel="noopener noreferrer" className="underline text-white hover:text-blue-300">
          https://www.ctscreener.xyz
        </a>
      </li>
      <li>
        🐦 Twitter:{" "}
        <a href="https://x.com/ctScreener" target="_blank" rel="noopener noreferrer" className="underline text-white hover:text-blue-300">
          https://x.com/ctScreener
        </a>
      </li>
      <li>
        👥 X Community: <a href="https://x.com/i/communities/1933756019555061941/" target="_blank" rel="noopener noreferrer" className="underline text-white hover:text-blue-300">Join on X</a>
      </li>
      <li>
        💬 Telegram:{" "}
        <a href="https://t.me/ctscreener" target="_blank" rel="noopener noreferrer" className="underline text-white hover:text-blue-300">
          https://t.me/ctscreener
        </a>
      </li>
      <li>
        💠 Discord:{" "}
        <a href="https://discord.com/invite/Yhv3MEzyXB" target="_blank" rel="noopener noreferrer" className="underline text-white hover:text-blue-300">
          https://discord.com/invite/Yhv3MEzyXB
        </a>
      </li>
    </ul>
  </section>

  <section className="bg-white/5 border border-blue-400/20 backdrop-blur-lg shadow-xl rounded-2xl p-6">
    <h2 className="text-xl font-semibold text-blue-400 mb-3">🔒 Token Lock Info</h2>
    <p className="text-blue-100/90 mb-2">
      10% of the <span className="text-yellow-300 font-semibold">$ctS</span> total supply is locked until <strong>Sep 12, 2025</strong>.
    </p>
    <p className="text-sm text-blue-200">
      📜 Proof:{" "}
      <a href="https://solana.team.finance/view-coin/2pHPoTfkRjhxqo5JDzEyqRTftQivJHCiUiT5uGp2pump" target="_blank" rel="noopener noreferrer" className="underline text-white hover:text-blue-300">
        View on Team Finance
      </a>
    </p>
  </section>
</div>

</div>

    </DashboardLayout>
  );
}
