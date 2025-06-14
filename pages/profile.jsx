// pages/profile.jsx

import Head from "next/head";
import DashboardLayout from "@/components/DashboardLayout";
import Topbar from "@/components/Topbar";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react"

export default function ProfilePage() {
  const { user, authenticated } = usePrivy();
  const walletAddress = user?.wallet?.address;

  const shorten = (addr) => addr?.slice(0, 5) + "..." + addr?.slice(-4);

  const avatarStyles = ["bottts", "adventurer", "pixel-art", "identicon"];
  const [selectedStyle, setSelectedStyle] = useState(avatarStyles[0]);

  const [username, setUsername] = useState(shorten(walletAddress));

  const dicebearAvatar = `https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${walletAddress}`;

  const handleSave = async () => {
    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet_address: walletAddress,
        username,
        avatarStyle: selectedStyle,
      }),
    });

    if (res.ok) {
      alert("Profile saved!");
    } else {
      alert("Error saving profile");
    }
  };

  useEffect(() => {
  if (authenticated && walletAddress) {
    fetch(`/api/user/get?wallet=${walletAddress}`)
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username);
        setSelectedStyle(data.avatarStyle);
      });
  }
}, [authenticated, walletAddress]);

  return (
    <DashboardLayout>
      <Head>
        <title>Profile - ctScreener</title>
      </Head>
      <div className="text-white px-4 py-8">
        <Topbar />

        <h1 className="text-3xl font-bold mb-4">Profile</h1>

        {authenticated && user ? (
          <>
          <div className="flex items-center space-x-6">
            <img
              src={dicebearAvatar}
              alt="User Avatar"
              className="w-20 h-20 rounded-full border border-gray-600"
            />
            <div>
              <input
                className="bg-gray-900 text-white px-4 py-2 rounded border border-gray-700"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <p className="text-gray-400 mt-2">Wallet: {walletAddress}</p>
            </div>
          </div>

            <h2 className="text-xl font-semibold mb-2">Select Avatar Style</h2>
            <div className="flex space-x-4 mb-6">
              {avatarStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedStyle === style
                      ? "bg-purple-600 border-purple-400"
                      : "bg-gray-800 border-gray-600"
                  } hover:bg-purple-700 transition-colors`}
                >
                  {style}
                </button>
              ))}
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-2 bg-purple-600 rounded text-white hover:bg-purple-700 transition-colors"
            >
              Save
            </button>
          </>
        ) : (
          <p className="text-gray-400">Please log in to view your profile.</p>
        )}
      </div>

    </DashboardLayout>
  );
}
