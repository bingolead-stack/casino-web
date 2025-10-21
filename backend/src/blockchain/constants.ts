export const SOLANA_CHAIN_ID = 900;
export const BITCOIN_CHAIN_ID = 8086;
export const LITECOIN_CHAIN_ID = 18087;

export const cmcIds = {
  bitcoin: 1,
  solana: 5426,
  ethereum: 1027,
  bnb: 1839,
  polygon: 3890,
  base: 27716,
  gnosis: 608,
  arbitrum: 11841,
  avalanche: 5805,
  fantom: 3513,
};

export const chainIds: { [chainId: number]: string } = {
  1: 'ethereum',
  56: 'bsc',
  137: 'polygon',
  43114: 'avalanche',
  250: 'fantom',
  10: 'optimism',
  42161: 'arbitrum',
  100: 'gnosis',
  8453: 'base',
  [SOLANA_CHAIN_ID]: 'solana',
  [BITCOIN_CHAIN_ID]: 'bitcoin',
  [LITECOIN_CHAIN_ID]: 'litecoin',
};
