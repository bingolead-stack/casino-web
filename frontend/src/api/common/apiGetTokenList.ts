import { instance } from "../instance";
import { tToken } from "@/types/tToken";

export const apiGetTokenList = async (chainId: number) => {
  const res = await instance.get<tToken[]>(
    `/token-price/token-list?chainId=${chainId}`
  );
  return res.data;
};
