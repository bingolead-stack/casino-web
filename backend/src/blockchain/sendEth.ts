import { formatUnits } from 'viem';

// Import necessary Viem modules and functions
import {
  Address,
  createWalletClient,
  http,
  formatEther,
  parseEther,
  publicActions,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts'; // Convert private key to account
// import dotenv from 'dotenv'; // For loading environment variables
import { evmChains, rpcUrls } from './config';
import { createRpcClient } from './createRpcClient';
// dotenv.config();

export default async function sendEth(
  chainId: number,
  privateKey: string,
  destinationAddress: string,
  amountInEth: number = 0,
) {
  try {
    // Create an account from the private key
    const account = privateKeyToAccount(privateKey as `0x${string}`);

    // Create a wallet client with the specified account, chain, and HTTP transport
    const walletClient = createWalletClient({
      account,
      chain: evmChains[chainId],
      transport: http(rpcUrls[chainId]),
    }).extend(publicActions);

    const client = createRpcClient(chainId);

    let maxAmountToSend = BigInt(0);
    const gasPrice = await client.getGasPrice() + 1000000000n;
    const gasLimit = BigInt(300000);
    if (amountInEth) {
      maxAmountToSend = parseEther(amountInEth.toString());
    } else {
      const balance = await client.getBalance({
        address: account.address,
      });
      maxAmountToSend = balance - gasPrice * gasLimit;
    }

    if (maxAmountToSend <= 0n) {
      console.log('Insufficient funds to cover gas fees.');
      return;
    }

    // Send the transaction to the resolved ENS address
    const hash = await walletClient.sendTransaction({
      to: destinationAddress as `0x${string}`,
      value: maxAmountToSend,
      gasPrice: gasPrice,
    } as any);

    // Wait for the transaction to be mined
    const receipt = await walletClient.waitForTransactionReceipt({
      hash: hash,
    });
    console.log('Transaction confirmed:', receipt.transactionHash);

    return { txHash: hash, amount: +formatUnits(maxAmountToSend, 18) };
  } catch (ex) {
    console.error(ex);
    throw ex;
  }
}


export async function sendEthLowFee(
  chainId: number,
  privateKey: string,
  destinationAddress: string,
  amountInEth: number = 0,
) {
  try {
    // Create an account from the private key
    const account = privateKeyToAccount(privateKey as `0x${string}`);

    // Create a wallet client with the specified account, chain, and HTTP transport
    const walletClient = createWalletClient({
      account,
      chain: evmChains[chainId],
      transport: http(rpcUrls[chainId]),
    }).extend(publicActions);

    const client = createRpcClient(chainId);

    let maxAmountToSend = BigInt(0);
    const gasPrice = await client.getGasPrice();
    const gasLimit = BigInt(300000);
    if (amountInEth) {
      maxAmountToSend = parseEther(amountInEth.toString());
    } else {
      const balance = await client.getBalance({
        address: account.address,
      });
      maxAmountToSend = balance - gasPrice * gasLimit;
    }

    if (maxAmountToSend <= 0n) {
      console.log('Insufficient funds to cover gas fees.');
      return;
    }

    // Send the transaction to the resolved ENS address
    const hash = await walletClient.sendTransaction({
      to: destinationAddress as `0x${string}`,
      value: maxAmountToSend,
      gasPrice: gasPrice,
    } as any);

    // Wait for the transaction to be mined
    const receipt = await walletClient.waitForTransactionReceipt({
      hash: hash,
    });
    console.log('Transaction confirmed:', receipt.transactionHash);

    return { txHash: hash, amount: +formatUnits(maxAmountToSend, 18) };
  } catch (ex) {
    console.error(ex);
    // throw ex;
  }
}
