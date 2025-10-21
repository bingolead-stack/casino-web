import { tUser } from "@/types/tUser";
import { instance } from "../instance";

export const apiLazyDeposit = async (
  chainId: number,
  address: string,
) => {
  const res = await instance.post<tUser>(`/wallet/lazy-deposit`, {
    chainId,
    tokenAddress: address,
  });
  return res.data;
};
