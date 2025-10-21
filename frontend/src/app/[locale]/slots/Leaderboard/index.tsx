"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import styles from "./TopUserTable.module.scss";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { apiGetLeaderboard } from "@/api/common/apiGetLeaderboard";
import IconTrophy from "@/assets/icons/leaderboard/trophy.svg";
import IconFirst from "@/assets/icons/leaderboard/first.svg";
import IconSecond from "@/assets/icons/leaderboard/second.svg";
import IconThird from "@/assets/icons/leaderboard/third.svg";
import LeaderboardTimer from "./LeaderboardTimer";
import { tPrize } from "@/types/tPrize";
import { tPrizeUser } from "@/types/tPrizeUser";
import Image from "next/image";

const orderData = [
  {
    icon: <IconFirst />,
    title: "First",
  },
  {
    icon: <IconSecond />,
    title: "Second",
  },
  {
    icon: <IconThird />,
    title: "Third",
  },
];

export default function TopUserTable() {
  const isMobile = useMediaQuery(mobileMediaQuery);
  const [data, setData] = useState<tPrizeUser[]>([]);
  const [prize, setPrize] = useState<tPrize>();

  useEffect(() => {
    (async () => {
      try {
        const { prize: prize1, users } = await apiGetLeaderboard();
        setPrize(prize1);
        setData(users);
      } catch (ex) {
        console.error(ex);
        setData([]);
      }
    })();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.leaderboardTitle}>
        <div className="absolute blur-[10px] bg-[var(--primary-color)] md:w-[500px] w-[200px] h-[18px] bottom-[-4px]" />
        <div className="md:absolute relative bg-[#161820] px-[20px] py-[13px] md:left-[54px] rounded-full md:text-[20px] md:leading-[27px] text-[16px] leading-[20px] font-semibold">
          Prize pool:{" "}
          <span className="text-[var(--primary-color)]">
            {prize?.prize.toLocaleString()} USD
          </span>
        </div>
        <IconTrophy />
        <div className={styles.airdropContestText}>Airdrop Contest</div>
        <LeaderboardTimer
          endingTime={prize?.endedAt ? new Date(prize?.endedAt) : new Date()}
        />
      </div>
      <Table
        removeWrapper
        aria-label="Users"
        className="overflow-auto"
        classNames={{
          th: "text-[11px] md:text-[16px] md:py-[17px] bg-[#0000] border-b-[1px] border-b-[#6663]",
          td: "text-[12px] md:text-[18px] md:py-[17px] border-b-[1px] border-b-[#6663]",
        }}
      >
        <TableHeader>
          <TableColumn>Rank</TableColumn>
          <TableColumn>User</TableColumn>
          <TableColumn>
            <div className="flex justify-end">Wagered</div>
          </TableColumn>
          <TableColumn>
            <div className="flex justify-end">Prize</div>
          </TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((e, i) => (
            <TableRow key={e.userId}>
              <TableCell className="pl-[18px]">
                {i < orderData.length ? (
                  <div className="flex items-center md:gap-[20px] gap-[5px]">
                    {orderData[i].icon}
                    {orderData[i].title}
                  </div>
                ) : (
                  `${i + 1}th`
                )}
              </TableCell>
              <TableCell>
                <div className="flex md:gap-[13px] gap-[4px] items-center">
                  <img
                    src={e.User?.avatar || "/images/default-avatar.png"}
                    width={isMobile ? 16 : 27}
                    height={isMobile ? 16 : 27}
                    className="rounded-full"
                    alt={e.User?.userName}
                  />
                  {e.User?.userName}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
                  ${e.wagered.toLocaleString()}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-[var(--primary-color)] flex justify-end md:gap-[13px] gap-[4px] items-center">
                  ${e.prize?.toLocaleString()}
                  <Image
                    src={"/images/prize.webp"}
                    width={isMobile ? 16 : 27}
                    height={isMobile ? 16 : 27}
                    alt="Prize"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
