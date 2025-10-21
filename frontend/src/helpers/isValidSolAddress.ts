import { PublicKey } from "@solana/web3.js";

export const isValidSolAddress = (addr: string) => {
  if (!addr) {
    return false;
  }

  try {
    const address = new PublicKey(addr);
    return PublicKey.isOnCurve(address);
  } catch {
    return false;
  }
};
