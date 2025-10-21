import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface ILevelUpCardConditionProps {
  text: string;
}

export default function LevelUpCardCondition({
  text,
}: ILevelUpCardConditionProps) {
  return (
    <div className="flex items-center py-[4px] gap-[16px] md:text-[16x] text-[14px]">
      <FaCheckCircle size={18} color="#686C74" />
      <span className="text-[#FFF] capitalize">{text}</span>
    </div>
  );
}
