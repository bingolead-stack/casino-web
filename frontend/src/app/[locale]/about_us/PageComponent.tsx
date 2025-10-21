import React from "react";
import styles from "./Page.module.scss";
import PromotionBox from "./PromotionBox";
import { data } from "./data";

export default function PageComponent() {
  return (
    <div className={styles.container}>
      <PromotionBox />
      <div className="grid md:grid-cols-2 gap-[18px] grid-cols-1">
        {data.map((e) => (
          <div
            key={e.title}
            className="flex gap-[22px] p-[22px] rounded-[22px] border-1 border-[#FFFFFF11] bg-[#222733]"
          >
            <img
              src={"/images/about-us/" + e.icon}
              className="w-[54px] h-[54px]"
              alt={e.title}
            />
            <div className="flex flex-col gap-[10px]">
              <h5 className="text-[20px] leading-[27px] font-bold text-[#FFFFFF]">
                {e.title}
              </h5>
              <div className="text-[16px] leading-[22px] text-[#FFFFFF8E]">
                {e.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
