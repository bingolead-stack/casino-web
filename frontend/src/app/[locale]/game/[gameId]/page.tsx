import React from "react";
import dynamic from "next/dynamic";

const GamePageComponent = dynamic(() => import("./GamePageComponent"), {
  ssr: false,
});

export default function GamePage() {
  return <GamePageComponent />;
}
