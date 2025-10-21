import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import { ECPairFactory } from 'ecpair';
import { NetworkType } from './types';
import {
  broadcastTransaction,
  createTransaction,
  endpointFromNetworkType,
  networkFromNetworkType,
} from './utils';

export const getBtcBalance = async (address: string, network: NetworkType) => {
  const url = `${endpointFromNetworkType(network)}/api/address/${address}`;
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.status !== 200) {
      throw `Error in ${url}`;
    }

    const data = await res.json();
    console.debug(data);
    const balanceInSats =
      data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
    const balance = balanceInSats / 100000000;
    return balance;
  } catch (ex) {
    console.error('getBtcBalance Error ' + url);
    throw ex;
  }
};

export const generateBtcAddress = (networkType: NetworkType) => {
  const ECPair = ECPairFactory(ecc);

  const network = networkFromNetworkType(networkType);
  const keyPair = ECPair.makeRandom({ network });

  const p2wpkh = bitcoin.payments.p2wpkh({
    pubkey: keyPair.publicKey,
    network,
  });

  const privateKey = keyPair.toWIF();
  return { address: p2wpkh.address, privateKey };
};

// Main function to create and send transaction
export const sendBitcoin = async (
  fromPk: string,
  toAddr: string,
  btc_amount: number,
  network: NetworkType,
) => {
  try {
    const txHex = await createTransaction(fromPk, toAddr, btc_amount, network);
    const txId = await broadcastTransaction(txHex, network);
    console.log('Transaction ID:', txId);
    return txId;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
};
