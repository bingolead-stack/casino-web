"use client";

import React, { useMemo, useState } from "react";
import styles from "./Notification.module.scss";
import { FaBell } from "react-icons/fa";
import IconLed from "@/assets/icons/online-led.svg";

const notifications = [
  "We added Litecoin in the depositing and withdrawing",
  "We added bonus policy link in the footer",
];

export default function Notification() {
  const [openNotification, setOpenNotification] = useState(false);

  if (!notifications.length) {
    return null;
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.notification}
        type="button"
        onClick={() => setOpenNotification(true)}
      >
        <FaBell size={16} color="#FFF" />
        <div className={styles.badge} />
      </button>
      {openNotification && (
        <>
          <div
            className="fixed bg-[#0000] top-0 left-0 w-full h-full"
            onClick={() => setOpenNotification(false)}
          />
          <div className={styles.notificationBox}>
            <div className="flex gap-[8px] items-center font-semibold text-[16px] leading-[24px] py-[18px] px-[24px] border-b-1 border-[#FFFFFF0A]">
              <IconLed />
              Notifications
            </div>
            <div className="py-[18px] px-[24px] flex flex-col gap-[12px] text-[14px]">
              {notifications.map((e, index) => (
                <div className="rounded-[16px] bg-[#FFFFFF09] p-4" key={index}>
                  {e}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
