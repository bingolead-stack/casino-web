"use client";

import React, { useMemo } from "react";
import styles from "./CasinoSportSwitch.module.scss";
import { Link, usePathname } from "@/i18n/routing";

interface ICasinoSwiperSwitchProps {
  options: {
    icon?: React.ReactNode;
    text: string;
    href: string;
  }[];
}

export default function CasinoSwiperSwitch({
  options,
}: ICasinoSwiperSwitchProps) {
  const pathname = usePathname();

  const selected = useMemo(
    () => (pathname.startsWith("/sports/en") ? 1 : 0),
    [pathname]
  );

  return (
    <div className="relative">
      <div className="flex border-[2px] rounded-full border-[#FFFFFF1E] h-[40px]">
        {options.map((e, i) => (
          <Link
            key={e.text}
            className={
              "py-[9px] px-[12px] text-[14px] text-[#FFFFFF8E] w-[100px] flex items-center justify-center cursor-pointer gap-[9px] " +
              (selected === i ? styles.selected : "")
            }
            href={e.href}
          >
            {e.icon}
            {e.text}
          </Link>
        ))}
      </div>
      <div
        className={
          "w-[104px] rounded-full absolute h-full top-0 " +
          styles.gradientBorder
        }
        style={{
          transform: `translate(${selected * 100}px, 0px)`,
          transition: "all 0.3s",
        }}
      />
    </div>
  );
}
