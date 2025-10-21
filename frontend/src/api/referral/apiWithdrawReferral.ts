import { tBalance } from "@/types/tBalance";
import { instance } from "../instance";

export const apiWithdrawReferral = async () => {
  const res = await instance.post<tBalance>(`/referral/withdraw-referral`);
  return res.data;
};
