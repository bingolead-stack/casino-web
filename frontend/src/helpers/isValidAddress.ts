import { isAddress  } from "viem";
import { PublicKey } from "@solana/web3.js";

export const isValidAddress = (addr: string) => {
  if (!addr) {
    return false;
  }

  if (isAddress(addr)) {
    return true;
  }

  try {
    const address = new PublicKey(addr);
    return PublicKey.isOnCurve(address);
  } catch {
    return false;
  }
};
