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
        bg-white/5 border border-blue-400/20
        backdrop-blur-lg
      "
    >
      <h2 className="text-xl font-semibold mb-4">
        {container.container}{" "}
        <span
          className={`ml-2 inline-block w-3 h-3 rounded-full ${
            container.status === "ok" ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
      </h2>

      <ul className="pl-4 space-y-1">
        {(container.pool || []).map((browser, i) => (
          <li key={i} className="text-sm">
            Browser pool {i + 1} —{" "}
            <span className={browser.inUse ? "text-yellow-400" : "text-green-400"}>
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
