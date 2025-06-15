// pages/profile.jsx

import Head from "next/head";
import DashboardLayout from "@/components/DashboardLayout";
import Topbar from "@/components/Topbar";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast";
import TokenInfoCard from "@/components/TokenInfoCard";
import TweetList from "@/components/TweetList";
import { Trash } from "lucide-react";

export default function ProfilePage() {
  const { user, authenticated } = usePrivy();
  const { toast } = useToast();
  const walletAddress = user?.wallet?.address;
  const [history, setHistory] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [retriveJobId, setRetriveJobId] = useState(null);
  const [retriveData, setRetriveData] = useState({ tokenInfo: null, tweets: [] });
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  const shorten = (addr) => addr?.slice(0, 5) + "..." + addr?.slice(-4);

  const avatarStyles = ["bottts", "adventurer", "pixel-art", "identicon"];
  const [selectedStyle, setSelectedStyle] = useState(avatarStyles[0]);
  const [username, setUsername] = useState("");
  const dicebearAvatar = selectedStyle
    ? `https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${walletAddress}`
    : "";


  const pollJobResult = async (jobId, retries = 1500) => {
    if (!jobId || retries <= 0) return;

    try {
      if (retries === 1500) {
      setRetriveData({ tokenInfo: null, tweets: [] });
    }

    const hisRes = await fetch(`/api/user/search_history?job_id=${jobId}`);
    const hisJson = await hisRes.json();
    const savedTokenInfo = hisJson?.token_info;

    const jobRes = await fetch(`/api/jobProxy?job_id=${jobId}`);
    const jobJson = await jobRes.json();
    console.log("🔁 Job polling result:", jobJson);

    if (jobJson.status === "completed" && Array.isArray(jobJson.tweets)) {
      setRetriveData({
        tokenInfo: savedTokenInfo || { name: "Unknown", address: jobJson.keyword },
        tweets: jobJson.tweets,
      });
    } else if (jobJson.status === "processing") {
      setTimeout(() => pollJobResult(jobId, retries - 1), 3000);
    }
  } catch (err) {
    console.error("❌ Failed to poll job:", err);
  }
};

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
      fetch(`/api/user/search_history?wallet=${walletAddress}`)
        .then((res) => res.json())
        .then((data) => {
          setHistory(data);
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

      <div className="max-w-4l mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Profile</h1>

        {authenticated && user ? (
        <>
          {/* === Profile Card === */}
          <div className="bg-sidebar p-6 rounded-lg w-full">
            <div className="flex items-center space-x-6">
              <img
                src={dicebearAvatar}
                alt="User Avatar"
                className="w-24 h-24 rounded-full border border-gray-600 cursor-pointer hover:opacity-80"
                onClick={() => setShowAvatarOptions(true)}
              />
          <div className="flex-1 space-y-2">
            <input
              className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 w-full  w-[240px]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <p className="text-gray-400 text-sm break-all">Wallet: {walletAddress}</p>
          </div>
        </div>
      </div>

      {/* === Search History Card === */}
      <div className="bg-sidebar p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Search History</h2>
        {history.length > 0 ? (
          <ul className="space-y-3">
            {history.map((h) => (
              <li
                key={h._id}
                className="flex justify-between items-center text-sm text-gray-300 border-b border-gray-700 pb-2"
              >
                <div>
                  <div className="font-semibold">
                    {h.token_info?.name || "Unknown"} ({h.token_info?.symbol || ""})
                  </div>
                  <div className="text-xs text-gray-400">
                    {h.token_address.slice(0, 4)}...{h.token_address.slice(-4)}
                  </div>
                </div>
                <div className="flex flex-col items-end text-xs text-gray-400">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setRetriveJobId(h.job_id);
                        setShowPopup(true);
                        pollJobResult(h.job_id);
                      }}
                      className="text-blue-400 hover:underline text-xs"
                    >
                      Retrieve
                    </button>

                    <button
                      onClick={async () => {
                        await fetch(`/api/user/deleteHistory?job_id=${h.job_id}`, {
                          method: "DELETE",
                        });
                        setHistory(history.filter(item => item.job_id !== h.job_id));
                      }}
                      className="text-red-400 hover:text-red-600"
                      aria-label="Delete"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                  <span>
                    {h.created_at
                      ? new Date(h.created_at).toLocaleString()
                      : "Unknown"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No search history found.</p>
        )}
      </div>
    </>
  ) : (
    <p className="text-gray-400">Please log in to view your profile.</p>
  )}
    {showAvatarOptions && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-[#202232] p-6 rounded-lg max-w-sm w-full">
      <h2 className="text-lg font-semibold mb-4 text-white text-center">Select an Avatar</h2>
        <div
          className={`grid ${
            avatarStyles.length <= 2
              ? 'grid-cols-2'
              : avatarStyles.length <= 4
              ? 'grid-cols-2'
              : 'grid-cols-3'
          } gap-4`}
        >
        {avatarStyles.map((style) => (
          <div key={style} className="flex justify-center items-center">
          <img
            key={style}
            src={`https://api.dicebear.com/7.x/${style}/svg?seed=${walletAddress}`}
            alt={style}
            className={`w-20 h-20 rounded-full border-2 ${
              selectedStyle === style ? "border-purple-500" : "border-transparent"
            } cursor-pointer hover:opacity-80`}
            onClick={() => {
              setSelectedStyle(style);
            }}
          />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => setShowAvatarOptions(false)}
          className="px-4 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            await handleSave();
            setShowAvatarOptions(false);
          }}
          className="px-4 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

</div>
    </div>
    </DashboardLayout>
  );
}
