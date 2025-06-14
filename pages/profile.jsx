// pages/profile.jsx

import Head from "next/head";
import DashboardLayout from "@/components/DashboardLayout";
import Topbar from "@/components/Topbar";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, authenticated } = usePrivy();
  const { toast } = useToast();
  const walletAddress = user?.wallet?.address;

  const shorten = (addr) => addr?.slice(0, 5) + "..." + addr?.slice(-4);

  const avatarStyles = ["bottts", "adventurer", "pixel-art", "identicon"];
  const [selectedStyle, setSelectedStyle] = useState(avatarStyles[0]);
  const [username, setUsername] = useState("");
  const dicebearAvatar = selectedStyle
    ? `https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${walletAddress}`
    : "";

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
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save profile.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
  if (authenticated && walletAddress) {
    fetch(`/api/user/get?wallet=${walletAddress}`)
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username || shorten(walletAddress));
        setSelectedStyle(data.avatarStyle || "bottts");
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

    <div className="mt-10 max-w-lg">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        {authenticated && user ? (
          <>
          <div className="flex items-center space-x-8 mb-6">
            <img
              src={dicebearAvatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border border-gray-600"
            />
            <div className="flex flex-col space-y-3">
              <input
                className="bg-gray-900 text-white px-4 py-2 rounded border border-gray-700 w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <p className="text-gray-400 text-sm break-all">Wallet: {walletAddress}</p>
            </div>
          </div>

            <h2 className="text-xl font-semibold mb-3">Select Avatar Style</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {avatarStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-4 py-2 rounded-lg border text-sm ${
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
              className="px-8 py-3 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors"
            >
              Save
            </button>
          </>
        ) : (
          <p className="text-gray-400">Please log in to view your profile.</p>
        )}
      </div>
    </div>
    </DashboardLayout>
  );
}
