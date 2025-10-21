import React from "react";
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";

const LABELS = {
  "change-wallet": "Change wallet",
  connecting: "Connecting ...",
  "copy-address": "Copy address",
  copied: "Copied",
  disconnect: "Disconnect",
  "has-wallet": "Connect",
  "no-wallet": "Solana",
} as const;

export function SolanaWalletButton(props: any) {
  return <BaseWalletMultiButton {...props} labels={LABELS} />;
}
