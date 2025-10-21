import { tTransactionStatistics } from "@/types/tTransactionStatistics";
import { instance } from "../instance";
import { tBalance } from "@/types/tBalance";

export type tSubuserCreateTxRes = {
  agent: tBalance;
  user: tBalance;
  userStatistics: tTransactionStatistics;
};

export const apiAgentCreateUserTransaction = async (
  userId: string,
  cash: number,
  isDeposit: boolean
) => {
  const res = await instance.post<tSubuserCreateTxRes>(
    `/agent/user/${userId}/transaction`,
    {
      cash,
      isDeposit,
    }
  );
  return res.data;
};
