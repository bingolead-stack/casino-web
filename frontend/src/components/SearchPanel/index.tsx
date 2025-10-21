"use client";

import React, { useEffect, useMemo, useState } from "react";
import { tGR8Game } from "@/types/tGR8Game";
import { Input } from "@nextui-org/react";
import { Modal, ModalContent, ModalBody } from "@nextui-org/react";
import { apiGetGames } from "@/api/common/apiGetGames";
import { Link } from "@/i18n/routing";

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchPanel({ isOpen, onClose }: SearchPanelProps) {
  const [games, setGames] = useState<tGR8Game[]>([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    setGames([]);
    setKeyword("");
  }, [isOpen]);

  useEffect(() => {
    if (!keyword) {
      setGames([]);
    }

    (async () => {
      try {
        const games1 = await apiGetGames({ keyword });
        setGames(games1.data);
      } catch (ex) {
        console.error(ex);
      }
    })();
  }, [keyword]);

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      {/* <div className="my-dialog-content"> */}
      <ModalContent>
        <ModalBody className="p-[32px] pt-[40px] flex flex-col">
          <Input
            label="Search games"
            size="sm"
            variant="bordered"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <ul className="flex flex-col h-[400px] overflow-y-auto gap-2">
            {games.map((g) => (
              <li key={g.id}>
                <Link
                  className="flex h-[50px] items-center gap-4 hover:bg-[#333]"
                  href={`/game/${encodeURIComponent(g.id)}`}
                >
                  <img
                    src={g.imageUrl || g.img_custom || ""}
                    alt={g.id}
                    className="rounded-xl w-[48px] h-[48px]"
                  />
                  <div className="text-[14px]">{g.translationKey}</div>
                </Link>
              </li>
            ))}
          </ul>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
