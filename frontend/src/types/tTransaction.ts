export enum eTransactionType {
  deposit = "deposit",
  withdrawal = "withdrawal",
  rollback = "rollback",
}

export enum eTransactionPlatform {
  DepositVisa = "deposit.visa",
  DepositCard = "deposit.card",
  DepositGoogle = "deposit.google",
  DepositApple = "deposit.apple",
  DepositCrypto = "deposit.crypto",
  DepositManual = "deposit.manual",
  DepositAgent = "deposit.agent",
  WithdrawCrypto = "withdraw.crypto",
  WithdrawManual = "withdraw.manual",
  Sportsbook = "sport",
  Fungamess = "fungamess.casino",
  ReferralBonus = "referral.bonus",
  DepositBonus = "deposit.bonus",
  Transfer = "transfer",
}

export enum eTransactionCurrency {
  AUD = "AUD",
  AZN = "AZN",
  BDT = "BDT",
  BOB = "BOB",
  BRL = "BRL",
  CAD = "CAD",
  CLP = "CLP",
  EUR = "EUR",
  GEL = "GEL",
  GHS = "GHS",
  HUF = "HUF",
  IDR = "IDR",
  INR = "INR",
  IRR = "IRR",
  KES = "KES",
  KGS = "KGS",
  KZT = "KZT",
  LKR = "LKR",
  MDL = "MDL",
  MXN = "MXN",
  MYR = "MYR",
  MZN = "MZN",
  NGN = "NGN",
  NPR = "NPR",
  PEN = "PEN",
  PHP = "PHP",
  PKR = "PKR",
  PLN = "PLN",
  PYG = "PYG",
  RON = "RON",
  SGD = "SGD",
  THB = "THB",
  TJS = "TJS",
  TMT = "TMT",
  TZS = "TZS",
  UAH = "UAH",
  USD = "USD",
  UXB = "UXB",
  UYU = "UYU",
  UZS = "UZS",
  VND = "VND",
  XOF = "XOF",
  USDT = "USDT",
  USDC = "USDC",
  DAI = "DAI",
  MATIC = "MATIC",
  TRX = "TRX",
  METH = "METH",
  UBTC = "UBTC",
}

export type tTransaction = {
  id: string;
  cash: number;
  bonus: number;
  locked: number;
  io: number;
  type: eTransactionType;
  platform: string;
  currency: eTransactionCurrency;
  initiatedAt: Date;
  createdAt: Date;
  context: any;
  userId: string;
  chainId: number;
  tokenAddress: string | null;
  tokenAmount: number;
  isDeleted: number;
  note: string | null;
  txHash: string | null;
  gameId: number | null;
  eventType: string | null;
  eventId: string | null;
  tokenName: string;
  providerId: number | null;
  provider: string | null;
};
