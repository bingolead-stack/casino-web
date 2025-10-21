"use client";

import React, { useMemo } from "react";
import { navItems } from "./data";
import GameNavbarItem from "@/components/GameNavbarItem";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { useSearchParams } from "next/navigation";

export default function Navbar() {
  const isMobile = useMediaQuery(mobileMediaQuery);
  const navItemsArray = useMemo(() => navItems(isMobile ? 20 : 40), [isMobile]);
  const searchParams = useSearchParams();

  return (
    <div className="w-full flex justify-center mt-[18px] p-2">
      <div className="gap-[8px] bg-[var(--header-background)] md:border-[20px] border-[10px] border-[var(--header-background)] flex rounded-[20px] overflow-x-auto hide-scrollbar">
        {navItemsArray?.map((item) => (
          <GameNavbarItem
            key={item.id}
            id={item.id}
            icon={item.icon}
            text={item.text}
            basePath="/"
            selected={
              (searchParams.get("nav-category") || "all-games") === item.id
            }
          />
        ))}
      </div>
    </div>
  );
}
