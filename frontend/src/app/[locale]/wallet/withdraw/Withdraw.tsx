"use client";

import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import styles from "./Withdraw.module.scss";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { isValidSegwitAddress, LITECOIN } from "@/helpers/isValidSegwitAddress";
import { toast } from "react-toastify";
import { isValidSolAddress } from "@/helpers/isValidSolAddress";
import { isAddress } from "viem";
import { apiLazyWithdraw } from "@/api/wallet/apiLazyWithdraw";
import { useRecoilState } from "recoil";
import { userState } from "@/state/userState";
import { Link } from "@/i18n/routing";
import LoginRequest from "@/components/LoginRequest";
import { allChains, allChainsMap } from "@/config/chains";
import axios from "axios";
import {
  apiProfileFinancialActivity,
  tFinancialActivitySummarized,
} from "@/api/account/apiProfileFinancialActivity";
import Loader from "@/components/Loader";
import { selectedTokenState } from "@/state/selectedTokenState";
import PolicyDialog from "./PolicyDialog";
import {
  BITCOIN_CHAIN_ID,
  LITECOIN_CHAIN_ID,
  MONTHLY_WITHDRAW_LIMIT,
  SOLANA_CHAIN_ID,
  WEEKLY_WITHDRAW_LIMIT,
} from "@/config/constants";
import { tokenListState } from "@/state/tokenListState";
import BonusPermission from "./BonusPermission";

export default function Withdraw() {
  const [selectedToken] = useRecoilState(selectedTokenState);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [cash, setCash] = useState("");
  const [user] = useRecoilState(userState);
  const [financeSum, setFinanceSum] = useState<tFinancialActivitySummarized>();
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [openPolicyDialog, setOpenPolicyDialog] = useState(false);
  const [tokenList] = useRecoilState(tokenListState);
  const [chainIds, setChainIds] = useState<number[]>([]);
  const [selectedChains, setSelectedChains] = React.useState(new Set([1]));

  const chain = useMemo(
    () => allChainsMap[Number(Array.from(selectedChains)[0])],
    [selectedChains]
  );

  useEffect(() => {
    const chainIds1 = tokenList
      .filter((t) => t.dbField === selectedToken)
      .map((t) => t.chainId);
    setChainIds(chainIds1);
    setSelectedChains(new Set([chainIds1[0]]));
  }, [tokenList, selectedToken]);

  const userCash = useMemo(
    () => user?.["cash_" + selectedToken] || 0,
    [user, selectedToken]
  );

  const [isWithdrawable, bonusPassed, wagerPassed, monthlyLimit, weeklyLimit] =
    useMemo(() => {
      if (!financeSum || !user?.id) {
        return [false, false, false, false, false];
      }

      let bonusPassed = true;
      if (user?.wantBonus && !user?.bonusWithdrawPassed) {
        bonusPassed =
          (financeSum.totalResult.casinoBet || 0) >=
            financeSum.bonusDepositMoney * 40 ||
          (financeSum.totalResult.sportBet || 0) -
            (financeSum.totalResult.sportRollback || 0) >=
            (user.bonus_sum || 0) * 8;
      }

      let wagerPassed = true;
      let monthly = true;
      let weekly = true;
      if (user.vipLevel < 6) {
        wagerPassed =
          (financeSum.totalResult.casinoBet || 0) +
            (financeSum.totalResult.sportBet || 0) -
            (financeSum.totalResult.sportRollback || 0) >=
          (financeSum.totalResult.depositCrypto || 0) +
            (financeSum.totalResult.depositBonus || 0) +
            (financeSum.totalResult.depositManual || 0);
        weekly =
          (financeSum.weeklyResult.withdrawCrypto || 0) +
            (financeSum.weeklyResult.withdrawRequested || 0) <
          WEEKLY_WITHDRAW_LIMIT;
        monthly =
          (financeSum.monthlyResult.withdrawCrypto || 0) +
            (financeSum.monthlyResult.withdrawRequested || 0) <
          MONTHLY_WITHDRAW_LIMIT;
      }

      const isWithdrawable = bonusPassed && wagerPassed && monthly && weekly;
      return [isWithdrawable, bonusPassed, wagerPassed, monthly, weekly];
    }, [financeSum, user]);

  useEffect(() => {
    if (user?.id) {
      (async () => {
        try {
          setLoadingInfo(true);
          const finance = await apiProfileFinancialActivity({});
          setFinanceSum(finance);
        } catch (ex) {}
        setLoadingInfo(false);
      })();
    }
  }, [user?.id]);

  const onRequest = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!financeSum) {
        return;
      }

      if (selectedToken === "0") {
        toast.error("You can't withdraw USD balance for now");
        return;
      }

      if (selectedToken === "") {
        toast.error("Please select the balance you want to withdraw");
        return;
      }

      if (!address) {
        toast.error("Please input the address");
        return;
      }

      if (!isWithdrawable) {
        toast.error(
          "You are not able to withdraw. Please check privacy and policy now."
        );
        return;
      }

      if (
        chain.chainId === BITCOIN_CHAIN_ID &&
        !isValidSegwitAddress(address)
      ) {
        toast.error("Please input the valid BTC address");
        return;
      } else if (chain.chainId === LITECOIN_CHAIN_ID) {
        if (!isValidSegwitAddress(address, LITECOIN)) {
          toast.error("Please input the valid LTC address");
          return;
        }
      } else if (
        chain.chainId === SOLANA_CHAIN_ID &&
        !isValidSolAddress(address)
      ) {
        toast.error("Please input the valid Solana address");
        return;
      } else if (
        chain.chainId !== BITCOIN_CHAIN_ID &&
        chain.chainId !== SOLANA_CHAIN_ID &&
        !isAddress(address)
      ) {
        toast.error("Please input the valid address");
        return;
      }

      if (+cash < 1 || +cash > userCash) {
        toast.error("Please input the valid withdraw amount");
        return;
      }

      if (!user) {
        return;
      }

      if (user?.vipLevel < 6) {
        const weekly =
          (financeSum.weeklyResult.withdrawCrypto || 0) +
            (financeSum.weeklyResult.withdrawRequested || 0) +
            Number(cash) <
          WEEKLY_WITHDRAW_LIMIT;
        const monthly =
          (financeSum.monthlyResult.withdrawCrypto || 0) +
            (financeSum.monthlyResult.withdrawRequested || 0) +
            Number(cash) <
          MONTHLY_WITHDRAW_LIMIT;
        if (!weekly || !monthly) {
          toast.error(
            "You have exceeded the withdrawal amount. Please check the policy."
          );
          return;
        }
      }

      setLoading(true);
      try {
        await apiLazyWithdraw(
          +selectedToken || 1,
          address,
          +cash,
          selectedToken
        );
        toast.success("Successfully requested");
      } catch (ex) {
        if (axios.isAxiosError(ex)) {
          console.log(ex.response?.data.message);
          if (ex.response?.data.message === "low.balance") {
            toast.error("You don't have enough balance to witdhraw");
          } else if (ex.response?.data.message === "low.balance.requests") {
            toast.error(
              "You don't have enough balance to witdhraw. Please check the withdraw requests you submitted"
            );
          } else {
            toast.error("Something went wrong");
          }
        } else {
          toast.error("Something went wrong");
        }
      }
      setLoading(false);
    },
    [
      address,
      cash,
      selectedToken,
      userCash,
      isWithdrawable,
      chain,
      user?.vipLevel,
    ]
  );

  const statusComponent = useMemo(() => {
    if (isWithdrawable || !financeSum) {
      return <></>;
    }

    if (!bonusPassed) {
      return <BonusPermission data={financeSum.totalResult} />;
    }

    if (!wagerPassed) {
      return (
        <div className="text-[12px] text-[#ff3333]">
          You should bet at least 1x of deposit amount to withdraw money
        </div>
      );
    }

    if (!weeklyLimit) {
      return (
        <div className="text-[12px] text-[#ff3333]">
          You exceedeed monthly limit: {WEEKLY_WITHDRAW_LIMIT}
        </div>
      );
    }

    if (!weeklyLimit) {
      return (
        <div className="text-[12px] text-[#ff3333]">
          You exceedeed monthly limit: {MONTHLY_WITHDRAW_LIMIT}
        </div>
      );
    }

    return <></>;
  }, [
    financeSum,
    isWithdrawable,
    bonusPassed,
    wagerPassed,
    monthlyLimit,
    weeklyLimit,
  ]);

  if (!user?.id) {
    return <LoginRequest />;
  }

  return (
    <div className={styles.withdraw}>
      <div className={styles.container}>
        {isWithdrawable ? (
          <form onSubmit={onRequest} className="flex flex-col gap-[24px]">
            <div className="popular-networks">
              <div className="section-label">Supported Networks</div>
              {selectedToken === "0" ? (
                <div className="text-[12px] text-[#ff3333]">
                  You can&apos;t withdraw USD balance for now.
                </div>
              ) : (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="bordered"
                      className="flex items-center w-full"
                    >
                      <img
                        src={chain?.icon}
                        alt={chain?.name}
                        className="w-[20px] h-[20px]"
                      />
                      <span>{chain?.name}</span>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="chains"
                    closeOnSelect={true}
                    disallowEmptySelection
                    selectionMode="single"
                    className="w-full"
                    selectedKeys={selectedChains}
                    onSelectionChange={(e) => setSelectedChains(e as any)}
                    classNames={{
                      base: "w-full",
                    }}
                  >
                    {allChains
                      .filter((e) => chainIds.includes(e.chainId))
                      .map((e) => (
                        <DropdownItem key={e.chainId}>
                          <div className="flex items-center gap-[12px] p-[8px]">
                            <img
                              src={e.icon}
                              alt={e.name}
                              className="w-[20px] h-[20px]"
                            />
                            <span>{e.name}</span>
                          </div>
                        </DropdownItem>
                      ))}
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>
            <div className={styles.inputBox}>
              <div className={styles.label}>
                Receiving Address ({chain?.name || "Please select the chain"})
              </div>
              <input
                type="text"
                className="my-input px-[24px] py-[21px]"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoFocus
                autoCapitalize="off"
                readOnly={!chain}
              />
            </div>
            <div className="text-[12px]">
              Please enter the wallet address you wish to receive the funds on.
              Once confirmed, the withdrawal is usually processed within a few
              minutes.
            </div>
            <div className={styles.inputBox}>
              <div className={styles.label + " text-white"}>
                Amount in USD (Minimum: 1 USD)
              </div>
              <input
                type="text"
                className="my-input px-[24px] py-[21px]"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                className="btn btn-primary w-full"
                isLoading={loading}
              >
                Request withdrawal
              </Button>
              <Link
                className="btn w-full h-[40px]"
                href="/wallet/withdraw/history"
              >
                Withdrawal History
              </Link>
            </div>
          </form>
        ) : financeSum ? (
          <>{statusComponent}</>
        ) : loadingInfo ? (
          <Loader />
        ) : (
          <div>There was an error in loading transaction result</div>
        )}
        <div className="flex justify-center">
          <Button
            type="button"
            className="btn md:w-[50%] w-full"
            onClick={() => setOpenPolicyDialog(true)}
            isLoading={loading}
          >
            Withdrawal Rules
          </Button>
        </div>
      </div>
      <PolicyDialog
        isOpen={openPolicyDialog}
        onClose={() => setOpenPolicyDialog(false)}
      />
    </div>
  );
}
