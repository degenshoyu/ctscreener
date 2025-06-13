// pages/_app.js
import "@/styles/globals.css";
import dynamic from "next/dynamic";

const AppInner = dynamic(() => import("@/components/AppInner"), { ssr: false });

export default function App(props) {
  return <AppInner {...props} />;
}

