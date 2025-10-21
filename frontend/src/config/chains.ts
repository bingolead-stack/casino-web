import {
  BITCOIN_CHAIN_ID,
  LITECOIN_CHAIN_ID,
  SOLANA_CHAIN_ID,
} from "./constants";
import { tChain } from "@/types/tChain";

export const chainIds: { [network: string]: number } = {
  ethereum: 1,
  bsc: 56,
  polygon: 137,
  avalanche: 43114,
  fantom: 250,
  optimism: 10,
  arbitrum: 42161,
  gnosis: 100,
  base: 8453,
  solana: SOLANA_CHAIN_ID,
  bitcoin: BITCOIN_CHAIN_ID,
  litecoin: LITECOIN_CHAIN_ID,
};

export const ZERO_ADDRESS = "0x";

export const allChains: tChain[] = [
  {
    icon: "/images/tokens/abstract-logo.png",
    name: "Abstract",
    chainId: 2741,
    symbol: "Abstract ETH",
  },
  {
    icon: "/images/tokens/bitcoin-btc-logo.png",
    name: "BTC",
    symbol: "BTC",
    chainId: BITCOIN_CHAIN_ID,
  },
  {
    icon: "/images/tokens/litecoin-ltc-logo.png",
    name: "LTC",
    symbol: "LTC",
    chainId: LITECOIN_CHAIN_ID,
  },
  {
    icon: "/images/tokens/solana-sol-logo.png",
    name: "Solana",
    symbol: "SOL",
    chainId: SOLANA_CHAIN_ID,
  },
  {
    icon: "/images/tokens/ethereum-eth-logo.png",
    name: "Ethereum",
    symbol: "ETH",
    chainId: 1,
  },
  {
    icon: "/images/tokens/polygon-matic-logo.png",
    name: "Polygon",
    symbol: "POL",
    chainId: 137,
  },
  {
    icon: "/images/tokens/bnb-bnb-logo.png",
    name: "BSC",
    symbol: "BNB",
    chainId: 56,
  },
  {
    icon: "/images/tokens/base-logo.svg",
    name: "Base",
    symbol: "BASE",
    chainId: 8453,
  },
  {
    icon: "/images/tokens/avalanche-avax-logo.png",
    name: "Avalanche",
    symbol: "AVAX",
    chainId: 43114,
  },
  // {
  //   icon: "/images/tokens/gnosis-gno-gno-logo.png",
  //   name: "Gnosis",
  //   chainId: 100,
  // },
  {
    icon: "/images/tokens/fantom-ftm-logo.png",
    name: "Fantom",
    chainId: 250,
    symbol: "FTM",
  },
  // {
  //   icon: "/images/tokens/optimism-ethereum-op-logo.png",
  //   name: "Optimism",
  //   chainId: 10,
  // },
  // {
  //   icon: "/images/tokens/arbitrum-arb-logo.png",
  //   name: "Arbitrum",
  //   chainId: 42161,
  // },
];

export const allChainsMap: tChain[] = [];
allChains.forEach((c) => (allChainsMap[c.chainId] = c));

export const ethSignatureTypes = {
  Person: [
    { name: "name", type: "string" },
    { name: "wallet", type: "address" },
  ],
  Transaction: [
    { name: "from", type: "Person" },
    { name: "to", type: "Person" },
    { name: "transaction", type: "string" },
    { name: "tokenAmount", type: "string" },
    { name: "tokenAddress", type: "string" },
    { name: "chainId", type: "string" },
  ],
};
