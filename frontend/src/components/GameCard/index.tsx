"use client";

import styles from "./GameCard.module.scss";
import React, { useCallback, useEffect, useState } from "react";
import { tGR8Game } from "@/types/tGR8Game";
import { useRecoilState } from "recoil";
import { Link } from "@/i18n/routing";
import { FaHeart, FaPlay, FaRegHeart } from "react-icons/fa";
import { favoritesGameFlagState } from "@/state/favoritesGameFlagState";
import { apiAddFavoritesGame } from "@/api/favorites/apiAddFavoritesGame";
import { apiDeleteFavoritesGame } from "@/api/favorites/apiDeleteFavoritesGame";
import { favoritesGameState } from "@/state/favoritesGameState";
import { userState } from "@/state/userState";
import { useSearchParams } from "next/navigation";

interface GameCardProps {
  data: tGR8Game;
}

const DEFAULT_IMAGE_URL = "/images/placeholder-Casino.webp";

export default function GameCard({ data }: GameCardProps) {
  const [favoritesGameFlag, setFavoritesGameFlag] = useRecoilState(
    favoritesGameFlagState
  );
  const [favoriteGames, setFavoriteGames] = useRecoilState(favoritesGameState);
  const [user] = useRecoilState(userState);
  const searchParams = useSearchParams();
  const [imageLoaded, setImageLoaded] = useState(false);

  const [imgSrc, setImgSrc] = useState(DEFAULT_IMAGE_URL);

  useEffect(() => {
    setImageLoaded(false);
    setImgSrc(data.imageUrl || data.img_custom || DEFAULT_IMAGE_URL);
  }, [data.img_custom, data.imageUrl]);

  const onError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setImgSrc(DEFAULT_IMAGE_URL);
    },
    []
  );

  const onLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageLoaded(true);
  };

  const onSetFavorite = useCallback(async () => {
    if (!favoritesGameFlag[data.id]) {
      try {
        await apiAddFavoritesGame(data.id);
        setFavoritesGameFlag((p) => ({ ...p, [data.id]: true }));
        setFavoriteGames((p) => [...p, data]);
      } catch (ex) {
        console.error(ex);
      }
    } else {
      try {
        await apiDeleteFavoritesGame(data.id);
        setFavoritesGameFlag((p) => ({ ...p, [data.id]: false }));
        setFavoriteGames((p) => {
          const i = p.findIndex((e) => e.id === data.id);
          if (i !== -1) {
            const p1 = [...p];
            p1.splice(i, 1);
            return p1;
          }
          return p;
        });
      } catch (ex) {
        console.error(ex);
      }
    }
  }, [favoritesGameFlag[data.id], setFavoritesGameFlag, setFavoriteGames]);

  return (
    <div className={styles.gameWrapper}>
      <div className={styles.game}>
        <Link
          className={styles.imgWrapper}
          href={
            `/game/${encodeURIComponent(data.id)}` +
            (searchParams.get("ref") ? "?ref=" + searchParams.get("ref") : "")
          }
        >
          <img
            className={styles.gameImage}
            src={imgSrc}
            alt={data.id}
            onError={onError}
            onLoad={onLoad}
          />
          {!imageLoaded && (
            <img
              className={styles.gamePlaceholderImage}
              src={DEFAULT_IMAGE_URL}
              alt={data.translationKey}
            />
          )}
          <div className={styles.overlap}>
            <div className={styles.play}>
              <FaPlay size={24} color="#9C0082" />
            </div>
          </div>
        </Link>
        <div className={styles.description}>
          <span title={data.gameProvider}>{data.translationKey}</span>
        </div>
      </div>
      {user?.id && (
        <div
          className="absolute w-[24px] h-[24px] flex items-center justify-center top-[6px] right-[4px] z-[2]"
          onClick={onSetFavorite}
        >
          {favoritesGameFlag[data.id] ? (
            <FaHeart size={20} color="#f00" />
          ) : (
            <FaRegHeart size={20} />
          )}
        </div>
      )}
    </div>
  );
}
