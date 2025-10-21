import { instance } from "../instance";

type tGetTokenRes = {
  tokenName: string;
  tokenSymbol: string;
  tokenLogo: string;
  tokenDecimals: string;
  usdPrice: number;
  usdPriceFormatted: string;
  exchangeAddress: string;
  exchangeName: string;
  tokenAddress: string;
  toBlock: string;
  possibleSpam: string;
  verifiedContract: true;
  pairAddress: string;
  pairTotalLiquidityUsd: string;
};

export const apiGetToken = async (chainId: number, tokenAddress: string) => {
  const res = await instance.get<tGetTokenRes>(
    `/blockchain/get-token/${chainId}/${tokenAddress}`
  );
  return res.data;
};
