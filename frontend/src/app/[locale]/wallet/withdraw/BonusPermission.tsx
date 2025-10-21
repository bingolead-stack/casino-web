"use client";

import { tSummarizedTransaction } from "@/types/tSummarizedTransaction";
import React from "react";

interface IBonusPermissionProps {
  data: tSummarizedTransaction;
}

export default function BonusPermission({ data }: IBonusPermissionProps) {
  return (
    <div className="flex flex-col gap-2 mt-[40px]">
      <div>
        Crypto deposit:{" "}
        <span className="text-white">
          ${(data.depositCrypto || 0).toLocaleString()}
        </span>
      </div>
      <div>
        Manual deposit:{" "}
        <span className="text-white">
          ${(data.depositManual || 0).toLocaleString()}
        </span>
      </div>
      <div>
        Signup Bonus:{" "}
        <span className="text-white">
          ${data.depositBonus?.toLocaleString()}
        </span>
      </div>
      <div>
        Crypto Withdraw:{" "}
        <span className="text-white">
          ${data.withdrawCrypto?.toLocaleString()}
        </span>
      </div>
      <div>
        Total Bet on Casino:{" "}
        <span className="text-white">
          ${(data.casinoBet || 0).toLocaleString()}
        </span>
      </div>
      <div>
        Total Bet on Sportsbook:{" "}
        <span className="text-white">
          ${((data.sportBet || 0) - (data.sportRollback || 0)).toLocaleString()}
        </span>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <span className="text-[#f00]">
          You should meet certain conditons to withdraw money
        </span>
        <div className="bg-[#111] p-4 rounded-[20px] text-white">
          Total Casino Bet &gt;= 40 * Bonus{" "}
          <span className="text-[#aaa]">OR</span> Total Sportsbook Bet &gt;= 8 *
          (Bonus + Deposit)
        </div>
      </div>
    </div>
  );
}
