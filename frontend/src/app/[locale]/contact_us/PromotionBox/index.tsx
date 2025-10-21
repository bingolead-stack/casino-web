"use client";

import React from "react";
import styles from "./PromotionBox.module.scss";
import { Link } from "@/i18n/routing";

export default function PromotionBox() {
  return (
    <div className={styles.container}>
      <div className="flex flex-col w-full justify-center md:px-[100px] md:py-[67px] p-[24px] items-center z-[2] ">
        <img src="/images/email_notify.png" className="w-[99px] h-[99px]" />
        <h2 className="font-bold md:text-[45px] md:leading-[45px] text-[36px] text-[#FFFFFF]">
          Get in touch
        </h2>
        <div className="mt-[21px] text-[18px] leading-[27px] text-[#FFFFFF8E] text-center">
          For customer support, please email{" "}
          <Link
            href="mailto:support@Casino.bet"
            className="text-[var(--primary-color)]"
          >
            support@Casino.bet
          </Link>
          &nbsp; and include your username and Player ID. For all other
          inquiries, please contact{" "}
          <Link
            href="mailto:info@Casino.bet"
            className="text-[var(--primary-color)]"
          >
            info@Casino.bet
          </Link>
        </div>
      </div>
      <img src="/images/contact-us-bg.png" className={styles.promotionImage} />
    </div>
  );
}
