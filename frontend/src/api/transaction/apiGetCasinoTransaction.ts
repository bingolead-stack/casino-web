import { tTransaction } from "@/types/tTransaction";
import { instance } from "../instance";
import { tPaginationResult } from "@/types/tPaginationResult";
import queryString from "query-string";

export type tSearchParams = {
  offset?: number;
  length?: number;
  startDate?: number;
  endDate?: number;
};

export const apiGetCasinoTransaction = async (params: tSearchParams) => {
  const res = await instance.get<tPaginationResult<tTransaction>>(
    `/profile/casino-history?${queryString.stringify(params)}`
  );
  return res.data;
};
