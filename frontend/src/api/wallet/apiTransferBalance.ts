import { instance } from "../instance";

export const apiTransferBalance = async (
  email: string,
  balance: number,
  tokenName: string
) => {
  const res = await instance.post<boolean>(`/wallet/transfer-balance`, {
    emailOrUsername: email,
    balance,
    tokenName,
  });
  return res.data;
};
