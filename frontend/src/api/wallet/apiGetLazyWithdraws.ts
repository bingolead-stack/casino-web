import { instance } from "../instance";
import { tPaginationResult } from "@/types/tPaginationResult";
import { tWithdrawRequest } from "@/types/tWithdrawRequest";

export const apiGetLazyWithdraws = async (
  offset: number,
  length: number
) => {
  const res = await instance.get<tPaginationResult<tWithdrawRequest>>(
    `/wallet/lazy-withdraw?offset=${offset}&length=${length}`
  );
  return res.data;
};
