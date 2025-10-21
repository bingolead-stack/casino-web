import * as  bitcoin from "bitcoinjs-lib";

export const LITECOIN = {
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

export function isValidSegwitAddress(
  address: string,
  network = bitcoin.networks.bitcoin
) {
  try {
    const decoded = bitcoin.address.fromBech32(address);
    return decoded.version === 0; // Check for SegWit version 0
  } catch (e) {
    // If fromBech32 throws an error, the address is not valid
    return false;
  }
}
