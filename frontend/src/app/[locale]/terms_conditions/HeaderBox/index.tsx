"use client";

import React, { useMemo } from "react";
import styles from "./HeaderBox.module.scss";

import PaperImage from "./paper.svg";
import PlayImage from "./play.svg";
import { Link } from "@/i18n/routing";

export default function HeaderBox() {
  return (
    <div className={styles.container}>
      <div className="absolute blur-[10px] bg-[var(--primary-color)] md:w-[80%] w-[300px] h-[18px] bottom-[-4px]" />
      <div className="flex md:flex-row flex-col items-center w-full px-[27px] py-[18px]">
        <PaperImage className={styles.paperImage} />
        <div className="flex flex-col flex-1">
          <div className={styles.textHeader}>General Terms and Conditions</div>
          <div className={styles.textContent}>
          Casino.bet may update, amend, edit, or supplement the Casino.bet Rules at
            any time. Users will be notified of any substantial amendments to
            the rules.
          </div>
        </div>
        <div className="flex flex-col md:ml-[50px] md:mt-0 mt-[20px]">
          <Link
            className="flex flex-row btn btn-primary w-[143px] h-[40px] text-[18px]"
            href={"/slots/all"}
          >
            <div>Play now</div>
            <PlayImage className="ml-[8px]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
