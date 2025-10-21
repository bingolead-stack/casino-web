"use client";

import React, { useCallback, useState, useEffect } from "react";
import { tGR8Game } from "@/types/tGR8Game";
import { useParams } from "next/navigation";
import { useRecoilState } from "recoil";
import { userState } from "@/state/userState";
import { Button } from "@nextui-org/react";
import { apiStartGame } from "@/api/game/apiStartGame";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { FaPlay } from "react-icons/fa";
import styles from "./GamePlay.module.scss";
import { selectedTokenState } from "@/state/selectedTokenState";
import { MdFullscreen } from "react-icons/md";

interface IGamePlayProps {
  game?: tGR8Game;
}

export default function GamePlay({ game }: IGamePlayProps) {
  const {
    gameId,
  }: {
    gameId: string;
  } = useParams();
  const [user] = useRecoilState(userState);
  const [iframeSrc, setIframeSrc] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const { locale }: { locale: string } = useParams();
  const [selectedChainId] = useRecoilState(selectedTokenState);
  const [isDemo, setIsDemo] = useState(false);

  const onPlay = useCallback(
    async (demo: boolean) => {
      setLoading(true);
      setIsDemo(demo);
      let iframeSrc1 = `${
        process.env.NEXT_PUBLIC_LAUNCH_URL
      }?gameId=${gameId}&channel=${
        isMobile ? "mobile" : "desktop"
      }&partnerKey=${process.env.NEXT_PUBLIC_PARTNER_KEY}&lobbyUrl=${encodeURI(
        "https://" + location.host
      )}`;
      
      if (!demo) {
        try {
          const sessionToken = await apiStartGame({
            gameId,
            tokenName: selectedChainId,
          });
          iframeSrc1 += `&sessionToken=${sessionToken}`;
          console.log(iframeSrc1);
        } catch (ex) {
          console.error(ex);
        }
      }

      setIframeSrc(iframeSrc1);
      setLoading(false);
    },
    [gameId, isMobile, selectedChainId]
  );

  useEffect(() => {
    if (selectedChainId && iframeSrc) {
      onPlay(isDemo);
    }
  }, [selectedChainId]);

  return (
    <div
      className={styles.container}
      style={
        fullscreen
          ? {
              position: "fixed",
              left: "0px",
              top: "0px",
              width: "100%",
              height: "100%",
              zIndex: 101,
              borderRadius: "0px",
            }
          : {}
      }
    >
      <input type="hidden" value={selectedChainId} />
      {iframeSrc ? (
        <iframe
          src={iframeSrc}
          className="w-full h-full absolute left-0 top-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          style={{ border: "none" }}
        />
      ) : (
        <>
          {(game?.imageUrl || game?.img_custom) && (
            <img
              src={game?.imageUrl || game?.img_custom || ""}
              className="w-full h-full object-cover"
              alt={game?.translationKey}
            />
          )}
          <div className="w-full h-full bg-[#000d] top-[0px] absolute" />
          <div className="absolute w-[300px] left-[calc(50%-150px)] top-[calc(50%-22px)] flex gap-[18px] z-[3] justify-center">
            {user?.id ? (
              <>
                <Button
                  className="h-[45px] w-[125px] bg-[var(--primary-color)]"
                  onClick={() => onPlay(false)}
                  isLoading={loading || !game?.translationKey}
                >
                  <FaPlay />
                  Play now
                </Button>
                <Button
                  className="h-[45px] w-[125px] text-[#FFFFFFB7]"
                  color="default"
                  onClick={() => onPlay(true)}
                  isLoading={loading || !game?.translationKey}
                >
                  <FaPlay />
                  Fun play
                </Button>
              </>
            ) : (
              <Button
                className="h-[45px] w-[125px]"
                color="default"
                onClick={() => onPlay(true)}
                isLoading={loading || !game?.translationKey}
              >
                <FaPlay />
                Fun play
              </Button>
            )}
          </div>
        </>
      )}
      <button
        type="button"
        className="bg-[#0006] p-[6px] rounded-[10px] absolute top-[10px] right-[10px]"
        onClick={() => setFullscreen((p) => !p)}
        title="Full Screen Mode"
      >
        <MdFullscreen size={24} />
      </button>
    </div>
  );
}
