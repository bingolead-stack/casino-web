import React from "react";
import dynamic from "next/dynamic";

const MyBetsPage = dynamic(() => import("./MyBetsPage"), { ssr: false });

export default function MyBetsHome() {
  return <MyBetsPage />;
}
