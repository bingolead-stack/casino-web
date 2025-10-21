import React from "react";
import dynamic from "next/dynamic";

const Home = dynamic(() => import("./slots/Home"), { ssr: false });

export default function HomePage() {
  return <Home />;
}
