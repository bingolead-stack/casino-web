export const SOLANA_CHAIN_ID = 900;
export const BITCOIN_CHAIN_ID = 8086;
export const LITECOIN_CHAIN_ID = 18087;
export const SOLANA_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_ENDPOINT || "";
export const ADMIN_BTC_WALLET = process.env.NEXT_PUBLIC_ADMIN_BTC_WALLET || "";
export const ADMIN_ETH_WALLET = (process.env.NEXT_PUBLIC_ADMIN_ETH_WALLET ||
  "") as `0x${string}`;
export const ADMIN_SOL_WALLET = process.env.NEXT_PUBLIC_ADMIN_SOL_WALLET || "";

export const mobileMediaQuery =
  "screen and ((max-width: 599px) or ((max-width: 1023px) and (orientation: landscape)))";

export const mobileLandscapeMediaQuery =
  "screen and ((max-width: 1023px) and (orientation: landscape))";

export const mobilePortraitMediaQuery =
  "screen and ((max-width: 1023px) and (orientation: portrait))";

export const supportingChainIds = [
  BITCOIN_CHAIN_ID,
  LITECOIN_CHAIN_ID,
  SOLANA_CHAIN_ID,
  1,
  137,
  56,
  250,
  0,
];
export const supportingTokenFields = [
  BITCOIN_CHAIN_ID.toString(),
  LITECOIN_CHAIN_ID.toString(),
  SOLANA_CHAIN_ID.toString(),
  "1",
  "137",
  "56",
  "250",
  "usdt",
  "usdc",
  "0",
];

export const WEEKLY_WITHDRAW_LIMIT = 10000;
export const MONTHLY_WITHDRAW_LIMIT = 40000;
