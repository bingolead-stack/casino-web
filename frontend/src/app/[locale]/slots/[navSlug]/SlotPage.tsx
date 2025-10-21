"use client";

import React, { useState, useEffect, useMemo } from "react";
import { tGR8Game } from "@/types/tGR8Game";
import GameCard from "@/components/GameCard";
import debounce from "lodash/debounce";
import { apiGetGames } from "@/api/common/apiGetGames";
import { Pagination } from "@nextui-org/react";
import Loader from "@/components/Loader";
import SearchInputIconLeft from "@/components/SearchInputIconLeft";
import ProviderFilter from "./ProviderFilter";
import ProviderGroup from "@/components/ProviderGroup";
import BuyCrypto from "@/components/BuyCrypto";
import { useParams, useSearchParams } from "next/navigation";
import { useRecoilState } from "recoil";
import { customGamesState } from "@/state/customGamesState";

const pageSize = 40;

export default function SlotPage() {
  const [games, setGames] = useState<tGR8Game[]>([]);
  const [keyword, setKeyword] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  const providerId = searchParams.get("providerId") || "";
  const type = searchParams.get("type") || "";
  const [customGames] = useRecoilState(customGamesState);
  const { navSlug }: { navSlug: string } = useParams();

  const debouncedFetchResults = useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        const param: {
          keyword: string;
          page: number;
        } = JSON.parse(searchQuery);

        try {
          setLoading(true);
          if (navSlug === "all") {
            const res = await apiGetGames({
              keyword: param.keyword,
              offset: (+param.page - 1) * pageSize,
              limit: pageSize,
              provider: providerId,
              type,
            });
            setGames(res.data);
            setTotal(res.total);
          } else if (navSlug === "bonus-buy") {
            const res = customGames
              .filter((c) => c.category === "slot-buy-bonus")
              .map<tGR8Game>((c) => c.GR8Game as tGR8Game)
              .filter((g) =>
                g.translationKey
                  .toLowerCase()
                  .includes(param.keyword.trim().toLowerCase())
              );
            setGames(
              res.slice((+param.page - 1) * pageSize, +param.page * pageSize)
            );
            setTotal(res.length);
          } else if (navSlug === "new-games") {
            const res = customGames
              .filter((c) => c.category === "slot-new")
              .map<tGR8Game>((c) => c.GR8Game as tGR8Game)
              .filter((g) =>
                g.translationKey
                  .toLowerCase()
                  .includes(param.keyword.trim().toLowerCase())
              );
            setGames(
              res.slice((+param.page - 1) * pageSize, +param.page * pageSize)
            );
            setTotal(res.length);
          } else if (
            navSlug === "live-casino" ||
            navSlug === "table-games" ||
            navSlug === "game-shows"
          ) {
            const res = customGames
              .filter((c) => c.category === navSlug)
              .map<tGR8Game>((c) => c.GR8Game as tGR8Game)
              .filter((g) =>
                g.translationKey
                  .toLowerCase()
                  .includes(param.keyword.trim().toLowerCase())
              );
            setGames(
              res.slice((+param.page - 1) * pageSize, +param.page * pageSize)
            );
            setTotal(res.length);
          } else if (
            navSlug === "roulette" ||
            navSlug === "blackjack" ||
            navSlug === "baccarat"
          ) {
            const res = await apiGetGames({
              keyword: param.keyword,
              offset: (+param.page - 1) * pageSize,
              limit: pageSize,
              provider: providerId,
              type: navSlug,
            });
            setGames(res.data);
            setTotal(res.total);
          }
        } catch (ex) {
          console.error(ex);
        }
        setLoading(false);
      }, 600),
    [customGames, navSlug, providerId]
  );

  useEffect(() => {
    debouncedFetchResults(
      JSON.stringify({
        keyword: keyword.trim(),
        page: currentPage,
      })
    );

    return () => {
      debouncedFetchResults.cancel();
    };
  }, [keyword.trim(), currentPage, debouncedFetchResults]);

  return (
    <div className="flex flex-col md:p-0 p-[16px]">
      <div className="flex gap-[12px]">
        <SearchInputIconLeft
          className="flex-1"
          value={keyword}
          placeholder="Search game"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <ProviderFilter buttonText={providerId} />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div
          className={
            "grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-x-[12px] justify-center mt-[57px] gap-y-[24px]"
          }
        >
          {games.map((e) => (
            <GameCard key={e.id} data={e} />
          ))}
        </div>
      )}
      <div className="flex items-center justify-center md:flex-row flex-col gap-2 p-4 mt-[24px]">
        <Pagination
          showControls
          total={Math.ceil(total / pageSize)}
          color="success"
          radius="full"
          page={currentPage}
          onChange={setCurrentPage}
          isCompact
        />
      </div>
      <ProviderGroup />
      <div className="mt-[34px]">
        <BuyCrypto />
      </div>
    </div>
  );
}
