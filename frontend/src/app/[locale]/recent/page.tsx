import React from "react";
import dynamic from "next/dynamic";

const Recent = dynamic(() => import("./Recent"), { ssr: false });

export default function RecentHome() {
  return <Recent />;
}
