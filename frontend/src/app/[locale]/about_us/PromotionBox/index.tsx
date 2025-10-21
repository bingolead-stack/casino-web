"use client";

import React, { useMemo } from "react";
import styles from "./PromotionBox.module.scss";

import IconBackground from "./Background.svg";
import { Link } from "@/i18n/routing";

export default function PromotionBox() {
  return (
    <div className={styles.container}>
      <div className="flex flex-col md:w-[568px] w-full justify-between md:px-[45px] md:py-[36px] p-[24px]">
        <h2 className="font-bold text-[30px] leading-[45px] text-[#FFFFFF]">
          About Casino.bet
        </h2>
        <div className="mt-[16px] text-[18px] leading-[27px] text-[#FFFFFF8E]">
          Licensed and regulated in Curacao, Casino.bet is a 2024-established
          leader in blockchain gaming. We provide a diverse range of iGaming
          products, all tested and provably fair
        </div>
        <Link className="btn btn-primary w-[140px] mt-[30px] h-[40px]" href={"/slots/all"}>
          Play now!
        </Link>
      </div>
      <div className={styles.promotionImage}>
        <IconBackground />
      </div>
    </div>
  );
}
