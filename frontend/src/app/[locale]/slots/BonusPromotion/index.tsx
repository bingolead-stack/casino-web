"use client";

import React from "react";
// import styles from "./BonusPromotion.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/a11y";
import { Autoplay,Mousewheel, Navigation, A11y } from "swiper/modules";
import PromotionCard from "./PromotionCard";
import { promotionCardData } from "./data";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";

export default function BonusPromotion() {
  const isMobile = useMediaQuery(mobileMediaQuery);

  return (
    <div className="w-full mx-0">
      <Swiper
        modules={[Mousewheel, Navigation, Autoplay, A11y]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        spaceBetween={20}
        slidesPerView={isMobile ? 1 : 2.2}
        centeredSlides={true}
        watchSlidesProgress={true}
      >
        {promotionCardData.map((promotion, index) => (
          <SwiperSlide key={index}>
            <PromotionCard {...promotion} />
          </SwiperSlide>
        ))}
         {promotionCardData.map((promotion, index) => (
          <SwiperSlide key={index}>
            <PromotionCard {...promotion} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
