import Image from "next/image";
import React from "react";
import { mobileMediaQuery } from "@/config/constants";
import { useMediaQuery } from "usehooks-ts";

interface IRewardCardProps {
  trendingColor: string;
  image: string;
  title: string;
  titleComment: string;
  description: string;
}

export default function RewardCard({
  trendingColor,
  title,
  image,
  titleComment,
  description,
}: IRewardCardProps) {
  const isMobile = useMediaQuery(mobileMediaQuery);

  return (
    <div
      className="w-full flex items-center md:gap-[36px] border-1 border-[#FFFFFF0A] rounded-[18px] md:py-[23px] md:px-[46px] p-[16px] gap-[18px]"
      style={{
        background: `linear-gradient(170deg, #1B1E27 10%, ${trendingColor} 120%)`,
      }}
    >
      <Image
        src={image}
        width={isMobile ? 36 : 72}
        height={isMobile ? 36 : 72}
        alt={title}
      />
      <div className="flex flex-col gap-[6px]">
        <h3 className="md:text-[25px] text-[18px] md:leading-[36px] leading-[22px] text-[#FFF] font-bold">
          <span>{title}</span>
          {titleComment && (
            <span className="text-[#FFFFFF80] ml-[4px]">{titleComment}</span>
          )}
        </h3>
        <div className="md:text-[16px] text-[14px] md:leading-[22px] leading-[18px] text-[#FFFFFF8E]">
          {description}
        </div>
      </div>
    </div>
  );
}
