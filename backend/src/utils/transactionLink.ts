import { BITCOIN_CHAIN_ID, LITECOIN_CHAIN_ID, SOLANA_CHAIN_ID } from "src/blockchain/constants";

export const transactionLink = (txHash: string, chainId: number) => {
  if (chainId === SOLANA_CHAIN_ID) {
    return `https://solscan.io/tx/${txHash}`;
  }

  if (chainId === BITCOIN_CHAIN_ID) {
    return `https://btcscan.org/tx/${txHash}`;
  }

  if (chainId === LITECOIN_CHAIN_ID) {
    return `https://litecoinspace.org/tx/${txHash}`;
  }

  if (chainId === 1) {
    return `https://etherscan.io/tx/${txHash}`;
  }

  if (chainId === 137) {
    return `https://polygonscan.com/tx/${txHash}`;
  }

  if (chainId === 56) {
    return `https://bscscan.com/tx/${txHash}`;
  }

  if (chainId === 43114) {
    return `https://snowtrace.io/tx/${txHash}`;
  }

  if (chainId === 250) {
    return `https://ftmscan.com/tx/${txHash}`;
  }

  if (chainId === 10) {
    return `https://optimistic.etherscan.io/tx/${txHash}`;
  }

  if (chainId === 42161) {
    return `https://arbiscan.io/tx/${txHash}`;
  }

  if (chainId === 100) {
    return `https://gnosisscan.io/tx/${txHash}`;
  }

  if (chainId === 8453) {
    return `https://basescan.org/tx/${txHash}`;
  }

  return "#";
};
