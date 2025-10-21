import { tUser } from "@/types/tUser";
import { instance } from "../instance";
import queryString from "query-string";
import { tSummarizedTransaction } from "@/types/tSummarizedTransaction";

export type tParam = {
  beginTimestamp?: number;
  endTimestamp?: number;
};

export type tFinancialActivitySummarized = {
  bonusMoney: number;
  bonusDepositMoney: number;
  totalResult: tSummarizedTransaction;
  monthlyResult: tSummarizedTransaction;
  weeklyResult: tSummarizedTransaction;
};

export const apiProfileFinancialActivity = async (params: tParam) => {
  const res = await instance.get<tFinancialActivitySummarized>(
    `/profile/financial-activity?${queryString.stringify(params)}`
  );
  return res.data;
};
