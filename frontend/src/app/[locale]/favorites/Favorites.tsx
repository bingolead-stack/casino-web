"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import SearchInputIconLeft from "@/components/SearchInputIconLeft";
import { tGR8Game } from "@/types/tGR8Game";
import debounce from "lodash/debounce";
import GameCard from "@/components/GameCard";
import { useRecoilState } from "recoil";
import { favoritesGameState } from "@/state/favoritesGameState";
import { userState } from "@/state/userState";
import LoginRequest from "@/components/LoginRequest";

export default function Live() {
  const [keyword, setKeyword] = useState("");
  const [games, setGames] = useState<tGR8Game[]>([]);
  const [gamelist] = useRecoilState(favoritesGameState);
  const [user] = useRecoilState(userState);

  const fetchResults = useCallback(
    (searchQuery: string) => {
      const search = JSON.parse(searchQuery);
      const res = gamelist.filter((g) =>
        g.translationKey.toLowerCase().includes(search.keyword.toLowerCase())
      );
      setGames(res);
    },
    [gamelist]
  );

  const debouncedFetchResults = debounce(fetchResults, 600);

  useEffect(() => {
    const searchQuery = JSON.stringify({
      keyword: keyword.trim(),
    });

    debouncedFetchResults(searchQuery);

    // Cleanup function to cancel any pending debounced calls
    return () => {
      debouncedFetchResults.cancel();
    };
  }, [keyword.trim(), debouncedFetchResults]);

  if (!user?.id) {
    return <LoginRequest />;
  }

  return (
    <div className="w-full p-[16px] md:p-0">
      <div className="mt-[18px] max-w-[1058px] w-full flex flex-col items-center">
        <SearchInputIconLeft
          placeholder="Search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
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
          You have not added any favorite games yet
        </div>
      )}
    </div>
  );
}
