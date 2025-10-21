"use client";

import React, { useState, useEffect } from "react";
import styles from "./ProfileBox.module.scss";
import { useRecoilState } from "recoil";
import { userState } from "@/state/userState";
import { mobileMediaQuery } from "@/config/constants";
import { useMediaQuery } from "usehooks-ts";
import {
  apiProfileFinancialActivity,
  tFinancialActivitySummarized,
} from "@/api/account/apiProfileFinancialActivity";

import IconIron from "@/assets/icons/vip/iron.svg";
import IconBronze from "@/assets/icons/vip/bronze.svg";
import VIPLevelChip from "@/components/VIPLevelChip";
import { numberRound } from "@/helpers/numberRound";
import { vipData } from "@/config/vipData";

export default function ProfileBox() {
  const [user] = useRecoilState(userState);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const [vipProgress, setVipProgress] = useState(0);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [financeSum, setFinanceSum] = useState<tFinancialActivitySummarized>();

  useEffect(() => {
    if (user?.id) {
      (async () => {
        try {
          setLoadingInfo(true);
          const finance = await apiProfileFinancialActivity({});
          setFinanceSum(finance);

          // calculate vip progress
          const wagered =
            (finance?.totalResult.casinoBet || 0) +
            (finance?.totalResult.sportBet || 0) -
            (finance?.totalResult.sportRollback || 0);
          const l0 = vipData[user.vipLevel].wagerAmount;
          const l1 = vipData[user.vipLevel + 1]?.wagerAmount;
          if (!l1) {
            setVipProgress(100);
          } else {
            if (wagered < l0) {
              setVipProgress(0);
            } else if (wagered > l1) {
              setVipProgress(100);
            } else {
              setVipProgress(
                numberRound((100 * (wagered - l0)) / (l1 - l0), 10)
              );
            }
          }
        } catch (ex) {}
        setLoadingInfo(false);
      })();
    }
  }, [user?.id]);

  return (
    <div className={styles.container}>
      <div className="flex flex-col md:w-[468px] w-full">
        <div className="rounded-full border-1 border-[#ADACA9] bg-[#222733] md:p-[28px] p-[8px] flex items-center">
          <img
            src={user?.avatar || "/images/default-avatar.png"}
            width={isMobile ? 36 : 72}
            height={isMobile ? 36 : 72}
            className="rounded-full"
            alt={user?.userName || "User"}
          />
          <div className="flex flex-col ml-[18px]">
            {user ? (
              <>
                <div className="flex gap-[8px] items-center">
                  <span className="font-bold md:text-[24px] text-[18px] md:leading-[36px] leading-[24px] text-[#FFF]">
                    {user?.userName}
                  </span>
                  <VIPLevelChip level={user?.vipLevel || 0} />
                </div>
                <div className="md:text-[18px] text-[14px] text-[#FFFFFF51]">
                  Wagered:{" "}
                  <span className="text-[#FFFFFF8E]">
                    $
                    {numberRound(
                      (financeSum?.totalResult.casinoBet || 0) +
                        (financeSum?.totalResult.sportBet || 0) -
                        (financeSum?.totalResult.sportRollback || 0),
                      100
                    ).toLocaleString()}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-[18px]">Please login</span>
            )}
          </div>
          <div className="md:w-[63px] md:h-[63px] w-[40px] h-[40px] flex justify-center items-center bg-[#2B3344] border-1 rounded-full border-[#FFFFFF1E] ml-auto">
            {vipData[user?.vipLevel || 0].icon}
          </div>
        </div>
        <div className="flex w-full mt-[38px] justify-between md:text-[18px] text-[14px]">
          <span className="text-[#fff] font-bold">Your VIP Progress</span>
          <span className="text-[#FFFFFFB7]">{vipProgress}%</span>
        </div>
        <div className="mt-[22px] relative bg-[#FFFFFF3D] h-[9px] rounded-full">
          <div
            className="absolute bg-[var(--primary-color)] h-[9px] rounded-full left-0 top-0"
            style={{
              width: `${vipProgress}%`,
            }}
          />
          <div
            className="absolute bg-[var(--primary-color)] w-[50px] h-[30px] flex items-center justify-center text-[#000] rounded-full top-[-10px] z-1 border-1 border-[border: 1px solid #FFFFFF28] font-bold text-[11px]"
            style={{
              left: `calc(${vipProgress}% - 25px)`,
            }}
          >
            {vipProgress}%
          </div>
        </div>
        <div className="flex justify-between w-full mt-[18px] md:text-[18px] text-[14px] text-[#FFFFFF8E]">
          <div className="flex items-center gap-[4px]">
            {vipData[user?.vipLevel || 0].icon}
            {vipData[user?.vipLevel || 0].vipTitle}
          </div>
          <div className="flex items-center gap-[4px]">
            {vipData[(user?.vipLevel || 0) + 1]?.icon || ""}
            {vipData[(user?.vipLevel || 0) + 1]?.vipTitle || ""}
          </div>
        </div>
      </div>
      <img
        src="/images/vip.png"
        className={styles.promotionImage}
        alt="Promotion"
      />
    </div>
  );
}
