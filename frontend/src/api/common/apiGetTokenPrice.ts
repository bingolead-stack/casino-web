import { instance } from "../instance";

export const apiGetTokenPrice = async (
  chainId: number,
  tokenAddress: string
) => {
  const res = await instance.get<number>(
    `/token-price/token-price?chainId=${chainId}&tokenAddress=${tokenAddress}`
  );
  return res.data;
};
