import { instance } from "../instance";
import { tPaginationResult } from "@/types/tPaginationResult";
import { tTransaction } from "@/types/tTransaction";
import queryString from "query-string";

export type tSubuserTransactionParams = {
  startDate?: number;
  endDate?: number;
  offset?: number;
  length?: number;
};

export const apiAgentGetSubuserTransactions = async (
  userId: string,
  params: tSubuserTransactionParams
) => {
  const res = await instance.get<tPaginationResult<tTransaction>>(
    `/agent/user/${userId}/transaction?${queryString.stringify(params)}`
  );
  return res.data;
};
