import {
  verifyTypedData,
  createPublicClient,
  http,
  decodeFunctionData,
  erc20Abi,
  formatUnits,
  parseUnits,
} from 'viem';
import { evmChains, rpcUrls } from './config';

export const createRpcClient = (chainId: number) => {
  if (evmChains[chainId]) {
    return createPublicClient({
      chain: evmChains[chainId],
      transport: http(rpcUrls[chainId]),
    });
  }

  return null;
};
