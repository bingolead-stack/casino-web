import {
  BITCOIN_CHAIN_ID,
  LITECOIN_CHAIN_ID,
  SOLANA_CHAIN_ID,
} from 'src/blockchain/constants';

export enum TransactionPlatform {
  DepositVisa = 'deposit.visa',
  DepositCrypto = 'deposit.crypto',
  DepositManual = 'deposit.manual',
  DepositAgent = 'deposit.agent',
  DepositBonus = 'deposit.bonus',
  WithdrawCrypto = 'withdraw.crypto',
  WithdrawManual = 'withdraw.manual',
  WithdrawBanned = 'withdraw.banned',
  WithdrawRequested = "withdraw.requested",
  WithdrawCancelled = 'withdraw.cancelled',
  Sportsbook = 'sport',
  Gr8Casino = 'gr8.casino',
  Fungamess = 'fungamess.casino',
  ReferralBonus = 'referral.bonus',
  Transfer = 'transfer',
  CustomGame = 'custom.game',
  LevelUpBonus = 'levelup.bonus',
  LeaderboardBonus = 'leaderboard.bonus',
  Rakeback = 'rakeback',
  Cashback = 'cashback',
}

export enum ErrorTypes {
  Duplicate = 'duplicate',
  LowBalance = 'low.balance',
  NotFound = 'not.found',
}

export const iframeEndpoints: { [host: string]: string } = {
  origin_name: 'iframe_endpoint_origin_name',
};

export const adminEmails = process.env.ADMIN_EMAILS.split(',');

export const S3_BUCKET = 's3_bucket_name';
export const S3_REGION = 's3_region';

export const supportingChainIds = [
  SOLANA_CHAIN_ID,
  BITCOIN_CHAIN_ID,
  LITECOIN_CHAIN_ID,
  1,
  56,
  137,
  43114,
  250,
];

export const supportingTokenFields = [
  '1',
  SOLANA_CHAIN_ID.toString(),
  BITCOIN_CHAIN_ID.toString(),
  LITECOIN_CHAIN_ID.toString(),
  '137',
  '56',
  '250',
  'usdt',
  'usdc',
];

export const RAKEBACK_HOUSE_PERCENT = 0.01;
