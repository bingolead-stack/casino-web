"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperProps, SwiperRef } from "swiper/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function MySwiper(
  props: React.RefAttributes<SwiperRef> & React.PropsWithChildren<SwiperProps>
) {
  const props1 = useMemo(() => ({ ...props, childrent: undefined }), [props]);
  return (
    <Swiper
      {...props1}
      navigation={{
        prevEl: ".prev",
        nextEl: ".next",
      }}
      className={props1.className + " my-swiper"}
    >
      {props.children}
      <div className="prev">
        <FaArrowLeft size={24} color="#fff" className="md:block hidden" />
        <FaArrowLeft size={16} color="#fff" className="md:hidden block" />
      </div>
      <div className="next">
        <FaArrowRight size={24} color="#fff" className="md:block hidden" />
        <FaArrowRight size={16} color="#fff" className="md:hidden block" />
      </div>
    </Swiper>
  );
}
