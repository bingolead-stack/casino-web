import React from "react";
import dynamic from "next/dynamic";

const VIPClub = dynamic(() => import("./VIPClub"), { ssr: false });

export default function VIPClubHome() {
  return <VIPClub />;
}
