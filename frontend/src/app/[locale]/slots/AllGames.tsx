"use client";

import React, { useState } from "react";
import GameGroup from "../../../components/GameLine";
import ProviderGroup from "@/components/ProviderGroup";

export default function AllGames() {
  return (
    <div className="flex flex-col gap-[12px] md:gap-[32px] w-full">
      <GameGroup
        title="X’MAS Tourney Boosters"
        gameType="slot-xmas"
        isCustom={true}
        viewallLink="/slots/all"
      />
      <GameGroup
        title="Hot"
        gameType="slot-hot"
        isCustom={true}
        viewallLink="/slots/all"
      />
      <ProviderGroup />
      <GameGroup
        title="New"
        gameType="slot-new"
        isCustom={true}
        viewallLink="/slots/all"
      />
      <GameGroup
        title="Popular Asia"
        gameType="slot-asia"
        isCustom={true}
        viewallLink="/slots/all"
      />
      <GameGroup
        title="Classic"
        gameType="slot-classic"
        isCustom={true}
        viewallLink="/slots/all"
      />
      <GameGroup
        title="Prosper games"
        gameType="slot-prosper-games"
        isCustom={true}
        viewallLink="/slots/all"
      />
      <GameGroup
        title="Buy bonus"
        gameType="slot-buy-bonus"
        isCustom={true}
        viewallLink="/slots/all"
      />
    </div>
  );
}
