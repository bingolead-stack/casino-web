import { tBalance } from "@/types/tBalance";
import { instance } from "../instance";

export const apiCancelLazyWithdraw = async (requestId: number) => {
  const res = await instance.delete<tBalance>(
    `/wallet/lazy-withdraw/${requestId}`
  );
  return res.data;
};
