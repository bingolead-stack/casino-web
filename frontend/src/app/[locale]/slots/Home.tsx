"use client";

import React from "react";
import styles from "./Home.module.scss";
import GameGroup from "@/components/GameLine";
import ProviderGroup from "@/components/ProviderGroup";
import Leaderboard from "./Leaderboard";
import BuyCrypto from "@/components/BuyCrypto";
import BonusPromotion from "./BonusPromotion";

export default function Home() {
  return (
    <div className={styles.home}>
      <BonusPromotion />
      <GameGroup
        title="Trending Games"
        gameType="trending-games"
        isCustom={true}
        viewallLink="/slots/all"
      />
      <GameGroup
        title="Live Casino"
        gameType="live-casino"
        isCustom={true}
        viewallLink="/slots/live-casino"
      />
      <ProviderGroup />
      <GameGroup
        title="Game Shows"
        gameType="game-shows"
        isCustom={true}
        viewallLink="/slots/game-shows"
      />
      <GameGroup
        title="Megaways"
        gameType="megaways"
        isCustom={true}
        viewallLink="/slots/all"
      />
      <GameGroup
        title="New games"
        gameType="slot-new"
        isCustom={true}
        viewallLink="/slots/all"
      />
      <Leaderboard />
      <div className="mt-[84px]">
        <BuyCrypto />
      </div>
    </div>
  );
}
