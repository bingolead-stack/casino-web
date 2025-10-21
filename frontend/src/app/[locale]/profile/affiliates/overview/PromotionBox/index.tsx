"use client";

import React, { useMemo } from "react";
import styles from "./PromotionBox.module.scss";
import { useRecoilState } from "recoil";
import { userState } from "@/state/userState";

import { FaLink } from "react-icons/fa";
import IconX from "@/assets/icons/social/x.svg";
import IconDiscord from "@/assets/icons/social/discord.svg";
import IconTelegram from "@/assets/icons/social/telegram.svg";
import { toast } from "react-toastify";

export default function PromotionBox() {
  const [user] = useRecoilState(userState);

  return (
    <div className={styles.container}>
      <div className="flex flex-col md:w-[508px] w-full justify-between md:px-[36px] md:py-[36px] p-[24px]">
        <h2 className="font-bold text-[30px] leading-[40px] text-[#FFFFFF]">
          Refer friends and get rewarded
        </h2>
        <div className="mt-[16px] text-[16px] leading-[24px] text-[#FFFFFF8E]">
          Earn for each friend you refer to Casino.bet and receive up to{" "}
          <span className="text-[var(--primary-color)]">30%</span>&nbsp;
          commission on their lifetime wager
        </div>
      </div>
      <div className="border-t-1 border-[#FFFFFF0A] md:px-[36px] md:pt-[28px] md:pb-[36px] w-full flex mt-auto p-[24px]">
        <div className="flex flex-col md:w-[calc(100%-550px)] w-full gap-[10px]">
          <div className="rounded-full flex bg-[#1C202A] items-center w-full px-[16px] py-[10px] md:flex-row flex-col">
            <div className="flex items-center flex-1">
              <FaLink size={16} color="#FFFFFFB7" />
              <span className="text-[16px] leading-[27px] text-[#FFFFFF8E] mx-[9px] flex-1 break-all">
                {`${location.protocol}//${location.host}?ref=${user?.referCode}`}
              </span>
            </div>
            <div className="flex items-center gap-[10px]">
              <IconX />
              <IconDiscord />
              <IconTelegram />
              <span
                className="text-[var(--primary-color)] text-[16px] cursor-pointer"
                onClick={() => {
                  const str = `${location.protocol}//${location.host}?ref=${user?.referCode}`;
                  navigator.clipboard.writeText(str);
                  toast.info("Copied " + str);
                }}
              >
                Copy Link
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.promotionImage}>
        <img src="/images/reward-promotion.png" alt="reward" />
      </div>
    </div>
  );
}
