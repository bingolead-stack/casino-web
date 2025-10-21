"use client";

import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { userState } from "@/state/userState";
import RewardCard from "../RewardCard";
import { apiGetReferredUsersCount } from "@/api/referral/apiGetReferredUsersCount";
import { tRewardResponse } from "@/types/tRewardResponse";
import { apiGetCalculatedReward } from "@/api/referral/apiGetCalculatedReward";
import { Button } from "@nextui-org/react";
import { apiWithdrawReferral } from "@/api/referral/apiWithdrawReferral";
import { toast } from "react-toastify";

export default function PageComponent() {
  const [user, setUser] = useRecoilState(userState);
  const [reward, setReward] = useState<tRewardResponse>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      (async () => {
        try {
          const reward1 = await apiGetCalculatedReward();
          setReward(reward1);
        } catch (ex) {
          console.error(ex);
        }
      })();
    }
  }, [user?.id]);

  const onWithdrawReward = async () => {
    setLoading(true);
    try {
      const balance = await apiWithdrawReferral();
      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              cash: balance.cash || 0,
              bonus: balance.bonus || 0,
              locked: balance.locked || 0,
              cash_0: balance.cash_0 || 0,
            }
          : null
      );
      toast.success("Successfully withdrawn referral money");

      const [reward1] = await Promise.all([apiGetCalculatedReward()]);
      setReward(reward1);
    } catch (ex) {
      console.error(ex);
      toast.error("Something went wrong in withdrawing money");
    }
    setLoading(false);
  };

  return (
    <div className="w-full md:p-0 p-[16px] flex flex-col gap-[16px]">
      <div className="grid md:grid-cols-4 grid-cols-1 gap-[18px] mt-[27px]">
        <RewardCard
          title="Total Reward"
          value={"$" + reward?.total.toLocaleString()}
          color="var(--primary-color)"
        />
        <RewardCard
          title="Paid Reward"
          value={
            "$" +
            (reward
              ? reward?.total - reward?.available - reward?.pending
              : 0
            ).toLocaleString()
          }
          color="var(--primary-color)"
        />
        <RewardCard
          title="Pending Reward"
          value={"$" + reward?.pending.toLocaleString()}
          color="var(--primary-color)"
        />
        <RewardCard
          title="Available Reward"
          value={"$" + reward?.available.toLocaleString()}
          color="var(--primary-color)"
        />
      </div>
      <div className="flex justify-end">
        <Button
          className="bg-[var(--primary-color)] text-[#0B0E1D] text-[14px] font-bold rounded-full flex items-center pt-[4px] w-full md:w-[200px]"
          onClick={onWithdrawReward}
          isLoading={loading}
        >
          WITHDRAW EARNINGS
        </Button>
      </div>
    </div>
  );
}
