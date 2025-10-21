"use client";

import React, { useMemo } from "react";
import styles from "./Layout.module.scss";
import { data } from "./data";
import { Link, usePathname } from "@/i18n/routing";
import { Chip } from "@nextui-org/react";

export default function HeaderBox() {
  const pathname = usePathname();
  const primaryKey = useMemo(() => pathname.split("/")[2], [pathname]);

  return (
    <div className="absolute left-0 top-0 w-full md:h-[150px] h-[120px] bg-[#1C202A] md:pt-[40px] pt-[20px] md:px-[54px] px-[20px] pb-[0] flex flex-col justify-between">
      <h1 className="md:text-[36px] md:leading-[45px] text-[24px] text-[#FFF] font-bold flex items-center gap-[18px]">
        {data[primaryKey].title}
        {(pathname.includes("/settings/") || pathname.includes("/bonus/")) && (
          <Chip color="danger" size="sm" className="bg-[#DE1111]">
            SOON
          </Chip>
        )}
      </h1>
      <div className="flex gap-[24px] overflow-x-auto w-full">
        {data[primaryKey]?.menu.map((e) => (
          <Link
            key={e.title}
            href={"/profile" + e.href}
            className="flex flex-col"
          >
            <span
              className="py-[10px] px-[2px] text-[16px] leading-[27px] font-semibold text-[#fff]"
              style={{
                color: pathname.startsWith("/profile" + e.href)
                  ? "#fff"
                  : "#FFFFFF8E",
              }}
            >
              {e.title}
            </span>
            <div
              className="h-[2px] w-full"
              style={{
                background: pathname.startsWith("/profile" + e.href)
                  ? "var(--primary-color)"
                  : "#0000",
              }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
