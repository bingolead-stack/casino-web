"use client";

import CopyInput from "@/components/CopyInput";
import { tToken } from "@/types/tToken";
import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react";
import { allChains, ethSignatureTypes } from "@/config/chains";
import { useCallback, useEffect, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { userState } from "@/state/userState";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import { useBlockchain } from "@/hooks/useBlockchain";
import {
  ADMIN_BTC_WALLET,
  ADMIN_ETH_WALLET,
  ADMIN_SOL_WALLET,
  BITCOIN_CHAIN_ID,
  LITECOIN_CHAIN_ID,
  SOLANA_CHAIN_ID,
} from "@/config/constants";
import { useSignTypedData } from "wagmi";
import { apiInstantDeposit } from "@/api/wallet/apiInstantDeposit";
import TokenAmountInput from "@/components/TokenAmountInput";
import { apiGetTokenPrice } from "@/api/common/apiGetTokenPrice";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { apiLazyDeposit } from "@/api/wallet/apiLazyDeposit";
import { numberRound } from "@/helpers/numberRound";
import { apiPredictDeposit } from "@/api/wallet/apiPredictDeposit";
import { apiSetWantBonus } from "@/api/account/apiSetWantBonus";
import { Link } from "@/i18n/routing";

interface DepositDialogProps {
  isOpen: boolean;
  onClose: () => void;
  token?: tToken;
}

export default function DepositDialog({
  isOpen,
  onClose,
  token,
}: DepositDialogProps) {
  const chain = useMemo(
    () => allChains.find((c) => c.chainId === token?.chainId),
    [token?.chainId]
  );

  const [user, setUser] = useRecoilState(userState);
  const [amount, setAmount] = useState("0");
  const [usd, setUsd] = useState(0);
  const [loadingSent, setLoadingSent] = useState(false);
  const { transferToken, address, signSolanaMessage } = useBlockchain();
  const { signTypedDataAsync } = useSignTypedData();
  const isMobile = useMediaQuery(mobileMediaQuery);
  const tokenAmount = useMemo(
    () => numberRound(usd ? +amount / usd : 0, 10000),
    [amount, usd]
  );
  const [loadingWantBonus, setLoadingWantBonus] = useState(false);

  const qrCanvas = useMemo(() => {
    const width = isMobile ? 80 : 160;
    if (token?.chainId === BITCOIN_CHAIN_ID) {
      return (
        <QRCodeCanvas
          value={`bitcoin:${user?.btcAddress || ""}?amount=${tokenAmount}`}
          size={width}
        />
      );
    }

    if (token?.chainId === LITECOIN_CHAIN_ID) {
      return (
        <QRCodeCanvas
          value={`litecoin:${user?.btcAddress || ""}?amount=${tokenAmount}`}
          size={width}
        />
      );
    }

    if (token?.chainId === SOLANA_CHAIN_ID) {
      return (
        <QRCodeCanvas
          value={`solana:${
            user?.solanaAddress || ""
          }?amount=${tokenAmount}&label=Casino.bet&message=Deposit`}
          size={width}
        />
      );
    }

    return (
      <QRCodeCanvas
        value={`ethereum:${user?.ethAddress || ""}?amount=${tokenAmount}`}
        size={width}
      />
    );
  }, [
    token?.chainId,
    user?.btcAddress,
    user?.solanaAddress,
    user?.ethAddress,
    isMobile,
    tokenAmount,
  ]);

  const addr = useMemo(() => {
    if (token?.chainId === BITCOIN_CHAIN_ID) {
      return user?.btcAddress;
    }

    if (token?.chainId === LITECOIN_CHAIN_ID) {
      return user?.ltcAddress;
    }

    if (token?.chainId === SOLANA_CHAIN_ID) {
      return user?.solanaAddress;
    }

    return user?.ethAddress;
  }, [token?.chainId, user?.btcAddress, user?.solanaAddress, user?.ethAddress]);

  useEffect(() => {
    setAmount("0");

    if (isOpen && token && token.chainId > 0 && !!token.tokenAddress) {
      apiPredictDeposit(token.chainId, token.tokenAddress)
        .then(() => {})
        .catch((ex) => console.error(ex));
    }
  }, [isOpen, token?.chainId, token?.tokenAddress]);

  useEffect(() => {
    if (!token) {
      return;
    }

    (async () => {
      try {
        if (
          token.dbField === "usdt" ||
          token.dbField === "usdc" ||
          token.dbField === "0"
        ) {
          setUsd(1);
        } else {
          const res = await apiGetTokenPrice(token.chainId, token.tokenAddress);
          setUsd(res);
        }
      } catch (ex) {
        setUsd(0);
        console.error("Something went wrong in getting token price");
      }
    })();
  }, [token?.chainId, token?.tokenAddress]);

  const onInstantDeposit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // if (!token) {
      //   toast.error("Token was not selected");
      //   return;
      // }

      // if (!address) {
      //   toast.error("Please connect wallet");
      //   return;
      // }

      // const n = Number(tokenAmount);
      // console.log(n);
      // if (!(n > 0)) {
      //   toast.error("Please input correct amount");
      //   return;
      // }

      // let txHash;
      // setLoading(true);

      // try {
      //   if (token?.chainId === 8086) {
      //     // ignore
      //   } else if (token?.chainId === 900) {
      //     // txHash = "5JeCwTW3vzUTZMRUCXszMkaHqjNzGk1F67bCdKcgCDVycgr8Z9muURper16GR5nJMnk12VieCRdJKrN9fPNDeKZT";
      //     txHash = await transferToken(token, n, ADMIN_SOL_WALLET);
      //   } else {
      //     // txHash = "0xd85bb62dc5d4d36809ddd998cd8515332058478a3b439c3ded22b74c812102e4";
      //     txHash = await transferToken(token, n, ADMIN_ETH_WALLET);
      //   }
      // } catch (ex) {
      //   console.error(ex);
      //   setLoading(false);
      //   return;
      // }

      // if (!txHash) {
      //   console.error("Something went wrong in sending tokens");
      //   setLoading(false);
      //   return;
      // }

      // // send request
      // if (token?.chainId === 8086) {
      //   try {
      //     await apiInstantDeposit(
      //       token.chainId,
      //       address,
      //       "",
      //       token.tokenAddress,
      //       n,
      //       txHash
      //     );
      //   } catch (ex) {
      //     toast.error("Something went wrong");
      //     setLoading(false);
      //     console.error(ex);
      //   }
      // } else if (token?.chainId === 900) {
      //   try {
      //     const message = JSON.stringify({
      //       address,
      //       to: ADMIN_SOL_WALLET,
      //       tokenAmount: n,
      //       tokenAddress: token?.tokenAddress,
      //       chainId: token?.chainId,
      //       transaction: txHash,
      //     });
      //     const signature = await signSolanaMessage(message);
      //     const signatureArr = Array.from(signature.signature);
      //     console.log({ signatureArr });

      //     await apiInstantDeposit(
      //       token.chainId,
      //       address,
      //       signatureArr,
      //       token.tokenAddress,
      //       n,
      //       txHash
      //     );
      //     toast.success("Deposited successfully");
      //     onClose();
      //   } catch (ex) {
      //     toast.error("Something went wrong");
      //     setLoading(false);
      //     console.error(ex);
      //   }
      // } else {
      //   try {
      //     const message = {
      //       from: {
      //         name: user?.email,
      //         wallet: address,
      //       },
      //       to: {
      //         name: "Admin",
      //         wallet: ADMIN_ETH_WALLET,
      //       },
      //       chainId: token.chainId.toString(),
      //       transaction: txHash,
      //       tokenAddress: token.tokenAddress,
      //       tokenAmount: n.toString(),
      //     };

      //     const signature = await signTypedDataAsync({
      //       types: ethSignatureTypes,
      //       primaryType: "Transaction",
      //       message: message,
      //     });

      //     await apiInstantDeposit(
      //       token.chainId,
      //       address,
      //       signature,
      //       token.tokenAddress,
      //       n,
      //       txHash
      //     );
      //     onClose();
      //     toast.success("Deposited successfully");
      //   } catch (ex) {
      //     toast.error("Something went wrong");
      //     setLoading(false);
      //     console.error(ex);
      //   }
      // }
      // setLoading(false);
    },
    [token, tokenAmount, transferToken, user?.email, address]
  );

  const onLazyDeposit = useCallback(async () => {
    setLoadingSent(true);
    try {
      const res = await apiLazyDeposit(
        token?.chainId || 0,
        token?.tokenAddress || ""
      );
      toast.success("Successed");
    } catch (ex) {
      console.error(ex);
      toast.error("Something went wrong");
    }
    setLoadingSent(false);
  }, [token]);

  const onSetBonus = useCallback(
    async (v: boolean) => {
      setLoadingWantBonus(true);
      try {
        await apiSetWantBonus(v);
        setUser((p) => (p ? { ...p, wantBonus: v } : null));
      } catch (ex) {
        console.error(ex);
      }
      setLoadingWantBonus(false);
    },
    [user?.id]
  );

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      className="my-dialog deposit-dialog"
    >
      {/* <div className="my-dialog-content"> */}
      <ModalContent>
        <ModalBody className="my-dialog-body">
          <h2 className="my-dialog-title">Your {chain?.name} Wallet</h2>
          {user?.wantBonus === null ? (
            <div className="flex flex-col">
              <div className="md:text-[14px] text-[12px]">
                You are doing first deposit now. Do you want to get bonus for
                the first deposit?
                <br />
                There are some restrictions in withdrawing if you choose to get
                bonus. Please check{" "}
                <Link
                  href="/wallet/deposit/privacy-policy"
                  className="font-bold text-white hover:underline"
                >
                  Terms and Conditions for New Depositors
                </Link>{" "}
                for details.
              </div>

              <div className="flex justify-center mt-4 gap-4">
                <Button
                  size="sm"
                  color="success"
                  className="flex-1 rounded-full"
                  onClick={() => onSetBonus(true)}
                  isLoading={loadingWantBonus}
                >
                  Yes, I want bonus
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  className="flex-1 rounded-full"
                  onClick={() => onSetBonus(false)}
                  isLoading={loadingWantBonus}
                >
                  No, I don&#39;t want bonus
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="instant-deposit">
                <p className="instant-deposit-title">
                  Please input the USD balance to deposit
                </p>
                <div
                  // onSubmit={onInstantDeposit}
                  className="instant-deposit-input"
                >
                  <TokenAmountInput
                    usdPrice={usd || 0}
                    tokenSymbol={token?.tokenSymbol || "ERR"}
                    value={amount}
                    autoFocus
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  {/* <Button
                      type="submit"
                      className="btn btn-primary-black"
                      isLoading={loading}
                    >
                      Send with Wallet Connect
                    </Button> */}
                </div>
              </div>

              <CopyInput
                value={addr || ""}
                onCopy={() => navigator.clipboard.writeText(addr || "")}
              />
              <div className="qr-description">
                <div className="qr-wrapper">{qrCanvas}</div>
                <div className="description">
                  <p className="text-white">
                    Only send {token?.tokenSymbol} to the address above through{" "}
                    {chain?.name} Network. (At least: {token?.minimumLimit || 0}{" "}
                    {token?.tokenSymbol})
                  </p>
                  <p>
                    After depositing, you can close this tab and wait for your
                    crypto payment to be processed. You can view the status of
                    your crypto payments from your profile page.
                  </p>
                  {/* <Button
                    color="primary"
                    type="button"
                    size="sm"
                    className="rounded-full"
                    onClick={onLazyDeposit}
                    isLoading={loadingSent}
                  >
                    Confirm Transaction
                  </Button> */}
                </div>
              </div>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
