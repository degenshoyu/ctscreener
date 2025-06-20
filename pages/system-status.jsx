import Head from "next/head";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function SystemStatusPage() {
  const [statusData, setStatusData] = useState([]);

    useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [api] = await Promise.all([
          fetch("/api/apiStatusProxy").then((r) => r.json()),
        ]);
        setStatusData([api])
      } catch (err) {
        console.error("❌ Failed to fetch system status:", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
       <Head>
        <title>System Status - ctScreener</title>
        <meta
          name="description"
          content="Realtime health and browser pool metrics of ctScreener infrastructure."
        />
      </Head>
<div className="text-white px-4 py-8">
  <h1 className="
    text-5xl font-extrabold mb-2
    bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-500
    bg-clip-text text-transparent
    drop-shadow-[0_2px_10px_rgba(96,165,250,0.3)]
  ">
    System Status
  </h1>
  <p className="text-lg text-blue-100/80 italic max-w-lg mb-6">
    Realtime health and usage metrics of Twitter scanning infrastructure.
  </p>

  {statusData.map((container, idx) => (
  <div
    key={idx}
    className="
      mb-6 p-6 rounded-2xl shadow-xl
      bg-gradient-to-br from-white/10 to-white/5 border border-blue-400/20
      backdrop-blur-xl transition transform hover:scale-[1.02]
    "
  >
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
      {container.container}
      <span className="relative flex h-3 w-3">
        <span className={`
          animate-ping absolute inline-flex h-full w-full rounded-full ${
            container.status === "ok" ? "bg-green-400" : "bg-red-400"
          } opacity-75`}></span>
        <span className={`
          relative inline-flex rounded-full h-3 w-3 ${
            container.status === "ok" ? "bg-green-500" : "bg-red-500"
          }`}></span>
      </span>
    </h2>

    <ul className="pl-2">
      {(container.pool || []).map((browser, i) => (
<li
  key={i}
  className="flex items-center justify-between text-sm py-1 pr-4"
>
  <div className="flex items-center gap-2">
    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
    Browser Pool {i + 1}
  </div>
  <span
    className={`
      px-2 py-0.5 rounded-full text-xs font-semibold
      ${browser.inUse 
        ? "bg-yellow-500/20 text-yellow-300" 
        : "bg-green-500/20 text-green-300"
      }
    `}
  >
    {browser.inUse ? "In Use" : "Available"}
  </span>
</li>
      ))}
    </ul>
  </div>
))}


</div>

    </DashboardLayout>
  );
}
