import React from "react";
import dynamic from "next/dynamic";

const SlotPage = dynamic(() => import("./SlotPage"), { ssr: false });

export default function Page() {
  return <SlotPage />;
}
