"use client";

import React from "react";
import { useRecoilState } from "recoil";
import { userState } from "@/state/userState";
import ProfileBox from "./ProfileBox";
import styles from "./VIPClub.module.scss";
import { rewardData } from "./data";
import RewardCard from "./RewardCard";
import BuyCrypto from "@/components/BuyCrypto";
import VIPCard from "./VIPCard";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { vipData } from "@/config/vipData";
import FAQ from "./FAQ";

export default function VIPClub() {
  const isMobile = useMediaQuery(mobileMediaQuery);

  return (
    <div className="w-full md:p-0 p-[16px]">
      <ProfileBox />
      <div className="flex flex-col md:mt-[90px] mt-[50px] md:gap-[36px] gap-[18px] pb-[90px] border-b-1 border-[#FFFFFF0A]">
        <h2 className={styles.neverEndingText}>
          Never-ending rewards &amp; benefits
        </h2>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-[18px]">
          {rewardData.map((e) => (
            <RewardCard key={e.title} {...e} />
          ))}
        </div>
      </div>
      <div className="md:mt-[72px] mt-[50px] flex flex-col w-full">
        <div className="flex justify-center">
          <h2 className={styles.levelUpTitle}>Level up your way to VIP</h2>
        </div>
        <div className="mt-[30px] md:text-[18px] text-[14px] md:leading-[27px] leading-[18px] text-center text-[#FFFFFF8E]">
          Wager to boost your cashback, rakebacks, level-up rewards, <br />
          and other bonuses. Stand out with a high rank.
        </div>
        <Swiper
          modules={[Navigation]}
          className="w-full mt-[75px]"
          spaceBetween={18}
          navigation
          slidesPerView={isMobile ? 1 : "auto"}
        >
          {vipData.map((e) => (
            <SwiperSlide key={e.vipTitle} className="flex w-[279px]">
              <VIPCard key={e.level} data={e} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <FAQ />
      <div className="mt-[84px]">
        <BuyCrypto />
      </div>
    </div>
  );
}
