export type tWithdrawRequest = {
  id: number;
  cash: number;
  chainId: number;
  note?: string | null;
  createdAt?: Date | string;
  issuedAt?: Date | string | null;
  txHash?: string | null;
  tokenAddress?: string | null;
  tokenAmount?: number;
  address: string;
  status?: number;
};
