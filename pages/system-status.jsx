import Head from "next/head";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Topbar from "@/components/Topbar";

export default function SystemStatusPage() {
  const [statusData, setStatusData] = useState([]);

    useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [api,live] = await Promise.all([
          fetch("/api/apiStatusProxy").then((r) => r.json()),
          fetch("/api/liveStatusProxy").then((r) => r.json()),
        ]);
        setStatusData([api, live])
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
    <Topbar />
      <h1 className="text-3xl font-bold mb-2">System Status</h1>
      <p className="text-gray-400 mb-6">Realtime health and usage metrics of Twitter scanning infrastructure</p>

      {statusData.map((container, idx) => (
        <div key={idx} className="mb-6 border rounded-lg p-4 bg-gray-900 text-white">
          <h2 className="text-xl font-semibold mb-2">
            {container.container}{" "}
            <span
              className={`ml-2 inline-block w-3 h-3 rounded-full ${
                container.status === "ok" ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
          </h2>

          <ul className="pl-4">
            {(container.pool || []).map((browser, i) => (
              <li key={i}>
                Browser pool {i + 1} –{" "}
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
