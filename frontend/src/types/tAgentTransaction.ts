import { eTransactionType } from "./tTransaction";

export type tAgentTransaction = {
  id: string;
  agentId: string;
  transactionType: eTransactionType;
  cash: number;
  createdAt: Date;
};
