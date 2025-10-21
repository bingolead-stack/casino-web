import React from "react";
import styles from "./Page.module.scss";
import { data } from "./data";
import { Link } from "@/i18n/routing";
import PromotionBox from "./PromotionBox";
import { FaArrowRight } from "react-icons/fa";
export default function PageComponent() {
  return (
    <div className={styles.container}>
      <PromotionBox />
      <div className="grid md:grid-cols-3 gap-[18px] grid-cols-1">
        {data.map((e) => (
          <div
            key={e.title}
            className="flex flex-col gap-[22px] p-[22px] rounded-[22px] border-1 border-[#FFFFFF11] bg-[#222733]"
          >
            <div className="flex flex-col md:gap-[27px] gap-[16px] flex-[1]">
              <h5 className="text-[20px] leading-[27px] font-bold text-[#FFFFFF] gap-[9px] flex flex-row items-center">
                <img src="/images/telegram.png" className="w-[27px] h-[27px]" />
                {e.title}
              </h5>
              <div className="text-[16px] leading-[22px] text-[#FFFFFF8E]">
                {e.description}
              </div>
            </div>
            <Link
              href={e.href}
              className="text-[var(--primary-color)] flex flex-row gap-[4.2px] mt-auto items-center"
            >
              {e.btn} <FaArrowRight color="var(--primary-color)" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
