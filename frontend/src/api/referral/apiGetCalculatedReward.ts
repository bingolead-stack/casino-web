import { tRewardResponse } from "@/types/tRewardResponse";
import { instance } from "../instance";

export const apiGetCalculatedReward = async () => {
  const res = await instance.get<tRewardResponse>(`/referral/reward`);
  return res.data;
};
