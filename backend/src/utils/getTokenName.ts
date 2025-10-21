import {
  BITCOIN_CHAIN_ID,
  LITECOIN_CHAIN_ID,
  SOLANA_CHAIN_ID,
} from 'src/blockchain/constants';

export const getTokenName = (dbField: string) => {
  const fields = {
    '0': 'USD',
    [SOLANA_CHAIN_ID.toString()]: 'SOL',
    [BITCOIN_CHAIN_ID.toString()]: 'BTC',
    [LITECOIN_CHAIN_ID.toString()]: 'LTC',
    '1': 'ETH',
    '56': 'BNB',
    '137': 'POL',
    '43114': 'AVAX',
    '250': 'FTM',
    '2741': 'Abstract ETH',
    usdt: 'USDT',
    usdc: 'USDC',
    visa: 'Visa',
  };

  return fields[dbField] || 'Unknown';
};
