"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { tGR8Game } from "@/types/tGR8Game";
import GameCard from "@/components/GameCard";
import { useRecoilState } from "recoil";
import { userState } from "@/state/userState";
import LoginRequest from "@/components/LoginRequest";
import { apiGetRecentGame } from "@/api/recent/apiGetRecentGame";

export default function Recent() {
  const [games, setGames] = useState<tGR8Game[]>([]);
  const [user] = useRecoilState(userState);

  useEffect(() => {
    if (user?.id) {
      (async () => {
        try {
          const res = await apiGetRecentGame({ offset: 0, limit: 40 });
          setGames(res.data);
        } catch (ex) {
          console.error(ex);
        }
      })();
    }
  }, [user?.id]);

  if (!user?.id) {
    return <LoginRequest />;
  }

  return (
    <div className="w-full">
      {games.length > 0 ? (
        <div
          className={
            "mt-[12px] grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-[12px] md:gap-[16px] justify-center"
          }
        >
          {games.map((e) => (
            <GameCard key={e.id} data={e} />
          ))}
        </div>
      ) : (
        <div className="text-center mt-4">
          You have not played any games yet
        </div>
      )}
    </div>
  );
}
