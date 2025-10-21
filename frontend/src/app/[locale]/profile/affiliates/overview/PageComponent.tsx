"use client";

import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { userState } from "@/state/userState";
import PromotionBox from "./PromotionBox";
import RewardCard from "../RewardCard";
import RewardGuideCard from "./RewardGuideCard";
import { FaAngleDoubleDown, FaAngleDoubleRight } from "react-icons/fa";
import { mobileMediaQuery } from "@/config/constants";
import { useMediaQuery } from "usehooks-ts";
import { apiGetReferredUsersCount } from "@/api/referral/apiGetReferredUsersCount";
import { tRewardResponse } from "@/types/tRewardResponse";
import { apiGetCalculatedReward } from "@/api/referral/apiGetCalculatedReward";

export default function PageComponent() {
  const [user] = useRecoilState(userState);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const [total, setTotal] = useState(0);
  const [reward, setReward] = useState<tRewardResponse>();

  useEffect(() => {
    if (user?.id) {
      (async () => {
        try {
          const [total1, reward1] = await Promise.all([
            apiGetReferredUsersCount(),
            apiGetCalculatedReward(),
          ]);
          setTotal(total1);
          setReward(reward1);
        } catch (ex) {
          console.error(ex);
        }
      })();
    }
  }, [user?.id]);

  return (
    <div className="w-full md:p-0 p-[16px]">
      <PromotionBox />
      <div className="grid md:grid-cols-4 grid-cols-1 gap-[18px] mt-[27px]">
        <RewardCard
          title="Total referrals"
          value={total.toLocaleString()}
          color="#ffffff"
        />
        <RewardCard
          title="Total Reward"
          value={"$" + reward?.total.toLocaleString()}
          color="#C9B5FD"
        />
        <RewardCard
          title="Available Reward"
          value={"$" + reward?.available.toLocaleString()}
          color="#C9B5FD"
        />
        <RewardCard
          title="Pending Reward"
          value={"$" + reward?.pending.toLocaleString()}
          color="#C9B5FD"
        />
      </div>
      <div className="mt-[28px] bg-[#1C202A] border-1 border-[#FFFFFF0A] rounded-[18px] flex flex-col">
        <h2 className="text-[20px] leading-[27px] text-[#ffffff] pt-[22px] pb-[19px] px-[22px] border-b-1 border-[#FFFFFF0A] font-semibold">
          How to Get your Referral Reward
        </h2>
        <div className="flex justify-between items-center py-[31px] px-[22px] md:flex-row flex-col md:gap-0 gap-[12px]">
          <RewardGuideCard
            no={1}
            title="Share with friends"
            description="Share your referral link or code with your friends."
          />
          {isMobile ? (
            <FaAngleDoubleDown size={24} color="#2B3344" />
          ) : (
            <FaAngleDoubleRight size={36} color="#2B3344" />
          )}
          <RewardGuideCard
            no={2}
            title="Receive $"
            description="Your rewards will be locked until your friends level up"
          />
          {isMobile ? (
            <FaAngleDoubleDown size={24} color="#2B3344" />
          ) : (
            <FaAngleDoubleRight size={36} color="#2B3344" />
          )}
          <RewardGuideCard
            no={3}
            title="Level up and Unlock"
            description="Your friend's VIP level upgrade unlocks your rewards "
          />
        </div>
      </div>
    </div>
  );
}
