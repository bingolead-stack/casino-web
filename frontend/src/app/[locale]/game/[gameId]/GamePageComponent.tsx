"use client";

import React, { useEffect, useState } from "react";
import { apiGetGameById } from "@/api/common/apiGetGameById";
import { tGR8Game } from "@/types/tGR8Game";
import { useParams } from "next/navigation";
import GamePlay from "./GamePlay";
import GameGroup from "@/components/GameLine";
import ProviderGroup from "@/components/ProviderGroup";
import BuyCrypto from "@/components/BuyCrypto";
import { useRecoilState } from "recoil";
import { providerState } from "@/state/providerState";

export default function GamePageComponent() {
  const {
    gameId,
  }: {
    gameId: string;
  } = useParams();
  const [game, setGame] = useState<tGR8Game>();

  useEffect(() => {
    (async () => {
      try {
        const game1 = await apiGetGameById(gameId);
        setGame(game1);
      } catch (ex) {
        console.error(ex);
      }
    })();
  }, [gameId]);

  return (
    <div className="flex flex-col gap-[40px] md:p-0 p-[12px]">
      <GamePlay game={game} />
      {game?.gameProvider && (
        <GameGroup
          title={
            "More from " +
            game?.gameProvider.substring(0, 1).toUpperCase() +
            game?.gameProvider.substring(1)
          }
          gameType=""
          isCustom={false}
          viewallLink={"/slots/all?providerId=" + game?.gameProvider}
          provider={game?.gameProvider}
          exceptGameId={game?.id}
        />
      )}
      <ProviderGroup />
      <BuyCrypto />
    </div>
  );
}
