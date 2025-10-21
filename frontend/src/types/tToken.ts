export type tToken = {
  id?: number;
  chainId: number;
  tokenAddress: string;
  usdPrice: number;
  updatedAt?: Date;
  minimumLimit: number;
  tokenName: string;
  tokenSymbol: string;
  tokenIcon: string;
  tokenDecimals: number;
  dbField: string;
};
