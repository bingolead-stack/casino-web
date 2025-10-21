"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react";
import { useRecoilState } from "recoil";
import IconInput from "./IconInput";
import axios from "axios";
import { toast } from "react-toastify";
import { userState } from "@/state/userState";
import IconUser from "@/assets/icons/login/user.svg";
import { apiTransferBalance } from "@/api/wallet/apiTransferBalance";
import { FaDollarSign } from "react-icons/fa";
import { numberRound } from "@/helpers/numberRound";
import { selectedTokenState } from "@/state/selectedTokenState";
import { allChainsMap } from "@/config/chains";
import { tokenListState } from "@/state/tokenListState";

interface ITransferBalanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransferBalanceDialog({
  isOpen,
  onClose,
}: ITransferBalanceDialogProps) {
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [user] = useRecoilState(userState);
  const [selectedToken] = useRecoilState(selectedTokenState);
  const userCash = useMemo(
    () => user?.["cash_" + selectedToken] || 0,
    [user, selectedToken]
  );
  const [tokenList] = useRecoilState(tokenListState);

  const enabled = useMemo(
    () => !!email && +balance >= 1 && +balance < userCash,
    [email, balance, userCash]
  );

  useEffect(() => {
    setEmail("");
    setBalance("");
  }, [isOpen]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (loading) {
        return;
      }

      if (!(!!email && +balance >= 1 && +balance < userCash)) {
        return;
      }

      setLoading(true);
      try {
        const res = await apiTransferBalance(email, +balance, selectedToken);
        toast.success(`Successfully transferred $${+balance}`);
        onClose();
        setLoading(false);
      } catch (ex) {
        if (axios.isAxiosError(ex)) {
          if (ex.response?.data?.message === "user.not-found") {
            toast.error("Recipient not found");
          } else if (
            ex.response?.data?.message === "balance.error" ||
            ex.response?.data?.message === "low.balance.error"
          ) {
            toast.error("Please input the correct balance");
          } else {
            toast.error("Something went wrong");
          }
        } else {
          toast.error("Something went wrong");
        }
        console.error(ex);
        setLoading(false);
      }
    },
    [email, balance, userCash, selectedToken]
  );

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent className="w-[540px]">
        <ModalBody className="md:p-[24px] p-[16px] flex flex-col items-center">
          <h2 className="font-bold text-[20px] leading-[27px] text-[#fff] mt-[20px]">
            Transfer{" "}
            {tokenList.find((t) => t.dbField === selectedToken)?.tokenSymbol}{" "}
            Balance
          </h2>
          <form
            className="flex flex-col py-[27px] border-t-1 border-[#FFFFFF0A] w-full gap-[18px]"
            onSubmit={onSubmit}
          >
            <IconInput
              icon={
                <div className="w-[24px] h-[24px] flex items-center justify-center">
                  <IconUser />
                </div>
              }
              placeholder={"Email Or Username"}
              value={email}
              autoCapitalize="off"
              onChange={(e) => setEmail(e.target.value)}
              autoFocus={true}
            />
            <IconInput
              icon={
                <div className="w-[24px] h-[24px] flex items-center justify-center">
                  <FaDollarSign size={20} />
                </div>
              }
              placeholder={"Balance"}
              value={balance}
              autoCapitalize="off"
              onChange={(e) => setBalance(e.target.value)}
            />
            {userCash >= 1 ? (
              <div className="text-center">
                Balance should be in{" "}
                <span className="text-[var(--primary-color)] font-bold">
                  $1
                </span>{" "}
                and&nbsp;
                <span className="text-[var(--primary-color)] font-bold">
                  ${numberRound(userCash, 100)}
                </span>
              </div>
            ) : (
              <div className="text-[#f33] text-center">
                Your balance is too low to transfer
              </div>
            )}
            <Button
              className="btn btn-primary h-[54px]"
              type="submit"
              isLoading={loading}
              isDisabled={!enabled}
            >
              Transfer
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
