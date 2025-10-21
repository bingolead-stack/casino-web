import { instance } from "../instance";

export const apiLazyWithdraw = async (
  chainId: number,
  address: string,
  cash: number,
  tokenName: string
) => {
  const res = await instance.post(`/wallet/lazy-withdraw`, {
    cash,
    chainId,
    address,
    tokenName,
  });
  return res.data;
};
