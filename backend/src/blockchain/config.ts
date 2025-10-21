import {
  arbitrum,
  avalanche,
  base,
  bsc,
  fantom,
  gnosis,
  mainnet,
  optimism,
  polygon,
  abstractTestnet,
  Chain,
} from 'viem/chains';
import { defineChain } from 'viem';
// import dotenv from 'dotenv'; // For loading environment variables
// dotenv.config();

export const abstract = defineChain({
  id: 2741,
  name: 'Abstract',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://api.mainnet.abs.xyz'],
      webSocket: ['wss://api.mainnet.abs.xyz/ws'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://abscan.org' },
  },
});

export const rpcUrls = {
  1: process.env.ETHEREUM_RPC_URL,
  56: process.env.BSC_RPC_URL,
  137: process.env.POLYGON_RPC_URL,
  43114: process.env.AVALANCHE_RPC_URL,
  250: process.env.FANTOM_RPC_URL,
  10: process.env.OPTIMISM_RPC_URL,
  42161: process.env.ARBITRUM_RPC_URL,
  100: process.env.GNOSIS_RPC_URL,
  8453: process.env.BASE_RPC_URL,
  2741: process.env.ABSTRACT_RPC_URL,
};

export const evmChains: { [chainId: number]: Chain } = {
  1: mainnet,
  56: bsc,
  137: polygon,
  43114: avalanche,
  250: fantom,
  10: optimism,
  42161: arbitrum,
  100: gnosis,
  8453: base,
  2741: abstract,
};
