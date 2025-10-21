"use client";

import React, { useState, useEffect } from "react";
import styles from "./RewardCard.module.scss";
import { FaClock } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

interface IRewardActionType {
  state: string;
  name: string;
  deadline: Date | null;
}

interface IRewardDetailType {
  name: string;
  value: string;
  icon: string;
}

export interface IRewardCardProps {
  id: number;
  name: string;
  color: string;
  img: string;
  data: Array<IRewardDetailType>;
  action: IRewardActionType;
}

export default function RewardCard({
  id,
  name,
  color,
  img,
  data,
  action,
}: IRewardCardProps) {
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    if (action.deadline) {
      const interval = setInterval(() => {
        if (action.deadline) {
          setRemainingTime(getRemainingTime(action.deadline));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [action.deadline]);

  const getRemainingTime = (deadline: Date) => {
    const now = new Date().getTime();
    const distance = deadline.getTime() - now;
    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      return days + "d:" + hours + "h:" + minutes + "m:" + seconds + "s";
    } else {
      return "Ended";
    }
  };

  return (
    <div className={styles.container + " " + styles[color]}>
      <img src={img} alt="avatar" className="justify-center" />
      <div className={styles.rewardTitle}> {name} </div>
      <div className="flex flx-col p-[10px] w-full bg-[#0000001A] rounded-[8px] h-[140px]">
        <div className="flex flex-col gap-[7px] text-[13px] color-[#D4DCEA] w-full">
          {data.map((d) => (
            <div key={d.name} className="flex flex-row items-start w-full">
              <div>{d.name}</div>
              <div className="flex flex-row items-center ml-auto">
                {d.value}
                {d.icon && (
                  <img
                    src={d.icon}
                    alt="icon"
                    className="w-[14px] h-[14px] ml-2"
                  />
                )}
              </div>
            </div>
          ))}
          {action.state === "PENDING" ? (
            <div className={styles.pendingButton}>
              <FaClock className="mr-[4px] w-[13px] h-[13px]" />
              <span className="text-[12.8px]  text-white">
                {action.name}
                {action.deadline && " " + remainingTime}
              </span>
            </div>
          ) : (
            <div className="btn btn-default flex flex-row items-center mt-auto w-full justify-center text-center min-h-[36px]">
              {action.state === "LOCKED" ? (
                <FaLock className="mr-[4px] w-[13px] h-[13px]" />
              ) : (
                ""
              )}
              <span className="text-[12.8px]  text-white">{action.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
