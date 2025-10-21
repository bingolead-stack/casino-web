import React from "react";
import styles from "./RewardCard.module.scss";

interface IRewardGuideCardProps {
  title: string;
  no: number;
  description: string;
}

export default function RewardGuideCard({
  title,
  no,
  description,
}: IRewardGuideCardProps) {
  return (
    <div className="flex flex-col gap-[13px] h-full">
      <div className="flex font-bold text-[18px] leading-[27px]">
        <span className="text-[#FFFFFF8E] mr-[4px]">
          {no.toString().padStart(2, "0")}.
        </span>
        <span className="text-[#C9B5FD]">{title}</span>
      </div>
      <div className="text-[16px] leading-[27px] text-[#FFFFFF8E]">
        {description}
      </div>
    </div>
  );
}
