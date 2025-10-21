import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import { ECPairFactory } from 'ecpair';
import { NetworkType } from './types';

const LITECOIN = {
  messagePrefix: '\x19Litecoin Signed Message:\n',
  bech32: 'ltc',
  bip32: {
    public: 0x019da462,
    private: 0x019d9cfe,
  },
  pubKeyHash: 0x30,
  scriptHash: 0x32,
  wif: 0xb0,
};

export const networkFromNetworkType = (networkType: NetworkType) => {
  if (networkType === 'bitcoin') {
    return bitcoin.networks.bitcoin;
  }

  if (networkType === 'litecoin') {
    return LITECOIN;
  }

  return null;
};

export const endpointFromNetworkType = (networkType: NetworkType) => {
  if (networkType === 'bitcoin') {
    return 'https://btcscan.org';
  }

  if (networkType === 'litecoin') {
    return 'https://litecoinspace.org';
  }

  return null;
};

// Fetch UTXOs (unspent transaction outputs) for the address
export const fetchUTXOs = async (address: string, networkType: NetworkType) => {
  const response = await fetch(
    `${endpointFromNetworkType(networkType)}/api/address/${address}/utxo`,
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );

  if (response.status !== 200) {
    const data = await response.text();
    throw new Error(data);
  }

  const data = await response.json();
  return data;
};

// Create and sign the transaction
export const createTransaction = async (
  fromPk: string,
  toAddress: string,
  btc_amount: number,
  networkType: NetworkType,
) => {
  const network = networkFromNetworkType(networkType);
  const ECPair = ECPairFactory(ecc);
  const keyPair = ECPair.fromWIF(fromPk, network);
  const p2wpkh = bitcoin.payments.p2wpkh({
    pubkey: keyPair.publicKey,
    network,
  });
  console.log('Address: ', p2wpkh.address);
  const address = p2wpkh.address;

  // fetch all utxos
  const utxos = await fetchUTXOs(address, networkType);
  const psbt = new bitcoin.Psbt({ network });

  let totalValue = 0;
  const fee = 1500;

  const endpoint = endpointFromNetworkType(networkType);
  for (const utxo of utxos) {
    const txHex = await fetch(`${endpoint}/api/tx/${utxo.txid}/hex`, {
      headers: { 'Content-Type': 'text/plain' },
    });

    const txHexData = await txHex.text();
    if (txHex.status !== 200) {
      throw new Error(txHexData);
    }

    const tx = bitcoin.Transaction.fromHex(txHexData);

    psbt.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        script: tx.outs[utxo.vout].script,
        value: BigInt(utxo.value.toString()),
      },
    });
    totalValue += utxo.value;
  }

  const sendAmount = Math.floor(btc_amount * 100000000 - fee);
  const remain = totalValue - sendAmount - fee;
  console.log({ sendAmount, totalValue, btc_amount });

  psbt.addOutput({
    address: toAddress,
    value: BigInt(sendAmount),
  });

  psbt.signAllInputs(keyPair);
  psbt.finalizeAllInputs();

  return psbt.extractTransaction().toHex();
};

// Broadcast the transaction
export const broadcastTransaction = async (txHex, networkType: NetworkType) => {
  const endpoint = endpointFromNetworkType(networkType);
  const response = await fetch(`${endpoint}/api/tx`, {
    method: 'POST',
    body: txHex,
    headers: { 'Content-Type': 'text/plain' },
  });

  const data = await response.text();
  if (response.status !== 200) {
    throw new Error(data);
  }
  return data;
};
