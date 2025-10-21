import React from "react";

import { tVIPLevelUp } from "@/types/tVIPLevelUp";
import LevelUpCardCondition from "./LevelUpCardCondition";
import { numberFormat } from "@/helpers/numberFormat";
import VIPLevelChip from "@/components/VIPLevelChip";

interface IVIPCardProps {
  data: tVIPLevelUp;
}

export default function VIPCard({ data }: IVIPCardProps) {
  return (
    <div className="flex-1 flex flex-col md:gap-[13px] gap-[8px]">
      <div className="w-full flex items-center">
        <div className="flex md:gap-[9px] gap-[6px] items-center px-[15px] py-[9px] bg-[#2B3344] border-1 rounded-full border-[#FFFFFF1E]">
          {data.icon}
          <span className="md:text-[20px] text-[16px] md:leading-[27px] leading-[18px] text-[#FFFFFF8E] font-medium">
            {data.vipTitle}
          </span>
        </div>
        <div className="flex-1 h-[1px] bg-[#FFFFFF0A]" />
      </div>
      <div className="flex flex-col rounded-[18px] p-[19px] border-1 border-[#FFFFFF1E] bg-[#222733]">
        <div>
          <VIPLevelChip level={data.level} />
        </div>
        <span className="mt-[18px] font-bold md:text-[30px] text-[20px] md:leading-[45px] leading-[24px] text-[#FFF]">
          ${numberFormat(data.wagerAmount)}
        </span>
        <span className="mt-[5px] md:text-[16x] text-[14px] leading-[27px] text-[#FFFFFF8E]">
          Wager amount
        </span>
        <div className="mt-[14px] flex flex-col">
          {!!data.conditions.rakeback && (
            <LevelUpCardCondition
              text={data.conditions.rakeback + "% Rakeback"}
            />
          )}
          {!!data.conditions.cashback && (
            <LevelUpCardCondition
              text={data.conditions.cashback + "% Cashback"}
            />
          )}
          <LevelUpCardCondition
            text={data.conditions.cashbackPeriod + " Cashback"}
          />
          {!!data.conditions.levelUpBonus && (
            <LevelUpCardCondition
              text={
                "$" +
                data.conditions.levelUpBonus.toLocaleString() +
                " Level Up bonus"
              }
            />
          )}
          {data.conditions.bPrivateVIPPromotions && (
            <LevelUpCardCondition text={"Private VIP promotions"} />
          )}
          {data.conditions.bPrivateVIPPromotions && (
            <LevelUpCardCondition text={"Customized Bonuses"} />
          )}
          {data.conditions.bPrivateVIPPromotions && (
            <LevelUpCardCondition text={"Dedicated VIP host"} />
          )}
        </div>
      </div>
    </div>
  );
}
