"use client";

import { Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./GameLine.module.scss";
import React, { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery, mobilePortraitMediaQuery } from "@/config/constants";
import { apiGetGames } from "@/api/common/apiGetGames";
import { tGR8Game } from "@/types/tGR8Game";
import GameCard from "@/components/GameCard";
import { Link } from "@/i18n/routing";
import MySwiper from "@/components/MySwiper";
import { useRecoilState } from "recoil";
import { customGamesState } from "@/state/customGamesState";

interface GameLineProps {
  title: string;
  gameType?: string;
  isCustom?: boolean;
  viewallLink?: string;
  provider?: string;
  exceptGameId?: string;
}

export default function GameLine({
  title,
  gameType,
  isCustom,
  viewallLink,
  provider,
  exceptGameId,
}: GameLineProps) {
  const isMobilePortrait = useMediaQuery(mobilePortraitMediaQuery);
  const [customGames] = useRecoilState(customGamesState);
  const [games, setGames] = useState<tGR8Game[]>([]);

  useEffect(() => {
    (async () => {
      const data = isCustom
        ? customGames
            .filter((c) => c.category === gameType)
            .slice(0, 20)
            .map((e) => e.GR8Game as tGR8Game)
        : (
            await apiGetGames({
              type: gameType,
              limit: 20,
              provider: provider,
            })
          ).data;
      setGames(data.filter((e) => e.id !== exceptGameId));
    })();
  }, [gameType, isCustom, customGames, provider, exceptGameId]);

  return (
    <div className={styles.gameGroup}>
      <div className={styles.titleBar}>
        <div className={styles.title}>
          <div className={styles.text}>{title}</div>
        </div>

        <Link href={viewallLink || "#"} className={styles.view}>
          See all
        </Link>
      </div>
      <MySwiper
        modules={[Mousewheel, Navigation]}
        className={styles.games}
        spaceBetween={isMobilePortrait ? 6 : 8}
        slidesPerView={isMobilePortrait ? 3 : "auto"}
        onSlideChange={() => console.log("slide change")}
        slidesPerGroup={isMobilePortrait ? 1 : 3}
      >
        {games.map((e) => (
          <SwiperSlide key={e.id} className={styles.game}>
            <GameCard data={e} />
          </SwiperSlide>
        ))}
      </MySwiper>
    </div>
  );
}
