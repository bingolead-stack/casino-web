"use client";

import { Link, usePathname } from "@/i18n/routing";
import React from "react";
import styles from "./SidebarAccordion.module.scss";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { sidebarExpandedState } from "@/state/sidebarExpandedState";
import { useRecoilState } from "recoil";

export interface ISidebarAccordionItemProps {
  icon: React.ReactNode;
  text: string;
  badge?: string;
  href: string;
}

export default function SidebarAccordionItem({
  icon,
  text,
  badge,
  href,
}: ISidebarAccordionItemProps) {
  const pathname = usePathname();
  const isMobile = useMediaQuery(mobileMediaQuery);
  const [sidebarExpanded, setSidebarExpanded] =
    useRecoilState(sidebarExpandedState);

  return (
    <Link
      className={
        "px-[16px] flex items-center h-[36px] " +
        (pathname === href ? styles.selectedItem : "")
      }
      href={href}
      onClick={() => {
        if (isMobile) {
          setSidebarExpanded(false);
        }
      }}
    >
      <div className="w-[24px] h-[24px] flex items-center justify-center mr-[16px]">
        {icon}
      </div>
      <span
        className={"text-[#FFFFFF8E] text-[14px] font-medium hover:text-[#fff] " + styles.text}
      >
        {text}
      </span>
      {badge && (
        <div className="ml-auto bg-[#DE1111] rounded-full text-[#fff] text-[11px] px-[5px] py-[2px]">
          {badge}
        </div>
      )}
    </Link>
  );
}
