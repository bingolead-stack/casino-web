import { tUserRole } from "./tUserRole";

export type tUser = {
  id: string;
  email: string;
  userName: string;
  emailVerified: boolean;
  verifyCode: string;
  verityTimeLimit: Date;
  role: string;
  agentId: string | null;
  referCode: string;
  refererId: string | null;
  subscription: string | null;
  cash: number;
  bonus: number;
  locked: number;
  bonus_sum: number;
  wantBonus: boolean | null;
  bonusWithdrawPassed: boolean;
  btcAddress: string;
  ltcAddress: string;
  ethAddress: string;
  solanaAddress: string;
  createdAt: Date;
  updatedAt: Date;
  isAgent?: boolean;
  totalDeposit?: number;
  totalWithdraw?: number;
  vipLevel: number;
  avatar?: string | null;
  cash_8086: number; // BTC
  cash_18087: number; // LTC
  cash_900: number; // SOL
  cash_1: number; // ETH
  cash_56: number; // BNB
  cash_137: number; // POL
  cash_43114: number; // AVAX
  cash_250: number; // FANTOM
  cash_0: number; // usd
  cash_2741: number; // abstract
  cash_usdt: number; // usdt
  cash_usdc: number; // usdc

  supportingUser: boolean; // Is user supporting
  smUserCursor: number; // Last support message id seen by user
} & {
  [key: string]: any;
};
