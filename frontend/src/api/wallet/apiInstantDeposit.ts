import { tUser } from "@/types/tUser";
import { instance } from "../instance";

export const apiInstantDeposit = async (
  chainId: number,
  address: string,
  signature: any,
  tokenAddress: string,
  tokenAmount: number,
  transactionHash: string,
) => {
  const res = await instance.post<tUser>(`/wallet/instant-deposit`, {
    signature,
    chainId,
    tokenAddress,
    tokenAmount,
    address,
    transactionHash,
  });
  return res.data;
};
