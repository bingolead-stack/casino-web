import { useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  useAccount,
  useChainId,
  useSwitchChain,
  useSendTransaction,
  useWriteContract,
} from "wagmi";
import { BITCOIN_CHAIN_ID, SOLANA_CHAIN_ID } from "@/config/constants";
import { tToken } from "@/types/tToken";
import { erc20Abi, parseEther, parseUnits } from "viem";
import {
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
  PublicKey,
} from "@solana/web3.js";
import { toast } from "react-toastify";
import nacl from "tweetnacl";
import {
  getAccount,
  getAssociatedTokenAddress,
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export const useBlockchain = () => {
  const { address: evmAddress } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const {
    publicKey: solanaPublicKey,
    sendTransaction: sendSolanaTransaction,
    signTransaction,
  } = useWallet();
  const evmChainId = useChainId();
  const { connection } = useConnection();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  const address = useMemo(
    () => solanaPublicKey?.toString() ?? evmAddress,
    [evmAddress, solanaPublicKey]
  );

  const chainId = useMemo(
    () => (solanaPublicKey ? SOLANA_CHAIN_ID : evmChainId),
    [evmChainId, solanaPublicKey]
  );

  const transferToken = async (token: tToken, n: number, recipient: string) => {
    console.log({ token, n, recipient });
    let txHash: string = "";
    if (token.chainId === BITCOIN_CHAIN_ID) {
      const leatherProvider = (window as any).LeatherProvider;
      if (!leatherProvider) {
        toast.error(
          "LeatherProvider not found. Install the Leather extension from leather.io/install."
        );
        return;
      }

      try {
        const response = await leatherProvider.request("sendTransfer", {
          recipients: [
            {
              address: recipient,
              amount: Math.round(n * 100000000),
            },
          ],
          account: 0,
        });

        console.log("Response:", response);
        console.log("Transaction ID:", response.result.txid);
        return response.result.txid;
      } catch (error: any) {
        console.error(error);
        if (error?.error?.code === 4001) {
          toast.info("The request was cancelled");
        }
      }
    } else if (token.chainId === SOLANA_CHAIN_ID) {
      if (!solanaPublicKey) {
        toast.error("Please connect solana wallet");
        return;
      }

      if (token.tokenAddress === "0x") {
        // native tokens

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: solanaPublicKey,
            toPubkey: new PublicKey(recipient),
            lamports: Math.round(n * LAMPORTS_PER_SOL),
          })
        );

        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = solanaPublicKey;

        const signature = await sendSolanaTransaction(transaction, connection);
        await connection.confirmTransaction(
          {
            signature,
            blockhash,
            lastValidBlockHeight: (
              await connection.getLatestBlockhash()
            ).lastValidBlockHeight,
          },
          "processed"
        );

        txHash = signature;
      } else {
        // custom tokens
        const tokenMintPublicKey = new PublicKey(token.tokenAddress);
        const recipientPublicKey = new PublicKey(recipient);

        // Get or create the associated token account for the recipient
        const recipientTokenAccount = await getAssociatedTokenAddress(
          tokenMintPublicKey,
          recipientPublicKey
        );

        // Get the sender's associated token account
        const senderTokenAccount = await getAssociatedTokenAddress(
          tokenMintPublicKey,
          solanaPublicKey
        );

        // Create the transfer instruction
        const transferInstruction = createTransferInstruction(
          senderTokenAccount,
          recipientTokenAccount,
          solanaPublicKey,
          Math.round(n * Math.pow(10, token.tokenDecimals))
        );

        // Create and send the transaction
        const transaction = new Transaction().add(transferInstruction);

        // transaction.feePayer = payer.publicKey;
        // const transaction = new Transaction().add(
        //   SystemProgram.transfer({
        //     fromPubkey: solanaPublicKey,
        //     toPubkey: new PublicKey(recipient),
        //     lamports: n * LAMPORTS_PER_SOL,
        //   })
        // );

        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = solanaPublicKey;

        const signature = await sendSolanaTransaction(transaction, connection);
        await connection.confirmTransaction(
          {
            signature,
            blockhash,
            lastValidBlockHeight: (
              await connection.getLatestBlockhash()
            ).lastValidBlockHeight,
          },
          "processed"
        );

        txHash = signature;
      }
    } else {
      if (!evmAddress) {
        toast.error("Please connect wallet");
        return;
      }

      try {
        await switchChainAsync({ chainId: token.chainId });
        if (token.tokenAddress === "0x") {
          // native tokens
          console.log("native token transfer");
          txHash = await sendTransactionAsync({
            to: recipient as `0x${string}`,
            value: parseEther(n.toString()),
          });
        } else {
          // custom tokens
          txHash = await writeContractAsync({
            chainId: token.chainId,
            address: token.tokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: "transfer",
            args: [
              recipient as `0x${string}`,
              parseUnits(n.toString(), token.tokenDecimals),
            ],
          });
        }
      } catch (ex) {
        console.error(ex);
      }
    }

    return txHash;
  };

  const signSolanaMessage = async (message: string) => {
    const getProvider = () => {
      if ("phantom" in window) {
        const provider = (window.phantom as any)?.solana;

        if (provider?.isPhantom) {
          return provider;
        }
      }

      window.open("https://phantom.app/", "_blank");
    };

    const provider = getProvider();
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await provider.signMessage(encodedMessage, "utf8");

    // Convert the signature from base64 to a Uint8Array
    const signatureUint8 = Uint8Array.from(signedMessage.signature);

    // Convert the public key to a Uint8Array
    const publicKeyObj = new PublicKey(
      "7qUCYpbZKMmhQUHq9RFbV5Luer5yKDB84xCJ7Mw9Ry66"
    );
    const publicKeyUint8 = publicKeyObj.toBytes();

    // Verify the signature
    const isValid = nacl.sign.detached.verify(
      encodedMessage,
      signatureUint8,
      publicKeyUint8
    );

    console.log({ signatureUint8, message, isValid });

    return signedMessage;
  };

  return {
    address,
    chainId,
    solanaPublicKey,
    transferToken,
    signSolanaMessage,
  };
};
