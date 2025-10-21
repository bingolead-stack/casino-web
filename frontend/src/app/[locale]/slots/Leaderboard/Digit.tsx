import React from "react";

interface IDigitProps {
  value: number;
  unit: string;
}

export default function Digit({ value, unit }: IDigitProps) {
  return (
    <div className="bg-[#161820] rounded-[14px] flex flex-col items-center justify-center w-[45px] h-[63px]">
      <span className="text-[var(--primary-color)] text-[20px] leading-[27px]">
        {value}
      </span>
      <span className="text-[#FFFFFF8E] text-[11px] leading-[18px]">
        {unit}
      </span>
    </div>
  );
}
