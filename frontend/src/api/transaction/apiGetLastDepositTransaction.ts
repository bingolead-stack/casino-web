import { tTransaction } from "@/types/tTransaction";
import { instance } from "../instance";

export const apiGetLastDepositTransaction = async () => {
  const res = await instance.get<tTransaction>(
    `/wallet/last-deposit-transaction`
  );
  return res.data;
};
