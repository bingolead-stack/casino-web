import React from "react";
import dynamic from "next/dynamic";

const Favorites = dynamic(() => import("./Favorites"), { ssr: false });

export default function FavoritesHome() {
  return <Favorites />;
}
