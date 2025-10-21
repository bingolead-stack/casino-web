"use client";

import React, { useState } from "react";
import { Modal, ModalContent, ModalBody, ModalHeader } from "@nextui-org/react";
import RewardData from "./data";
import RewardCard from "./RewardCard";
import styles from "./Page.module.scss";

interface IClaimRewardDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClaimRewardDialog({
  isOpen,
  onClose,
}: IClaimRewardDialogProps) {
  const [toggle, setToggle] = useState(0);

  const onToggle = (val: number) => {
    setToggle(val);
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      scrollBehavior="inside"
      size="5xl"
    >
      <ModalContent className={styles.container}>
        <ModalHeader className="pb-[28px] border-b-[1px] border-[#FFFFFF0A]">
          <div className="flex flex-col w-full">
            <div className={styles.modalHeader}>Claim Rewards</div>
            <div className="flex flex-row items-center bg-[#272D3C] text-[15.8px] mt-[30px] px-[5px] pt-[4px] pb-[5px] rounded-[9999px] w-full">
              <div
                className={
                  "flex-1 text-center rounded-[9999px] py-[13px] cursor-pointer" +
                  (toggle == 0 ? " text-white  bg-[#1A1D26]" : "")
                }
                onClick={() => onToggle(0)}
              >
                VIP
              </div>
              <div
                className={
                  "flex-1 text-center rounded-[9999px] py-[13px] cursor-pointer" +
                  (toggle == 1 ? " text-white  bg-[#1A1D26]" : "")
                }
                onClick={() => onToggle(1)}
              >
                Special
              </div>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="md:px-[32px] px-[18px] pt-[18px] md:pt-[39px] md:pb-[23px] pb-[18px]">
          <div className="grid grid-flow-row md:grid-cols-3 w-full gap-[20px] items-center">
            {RewardData.map((reward) => (
              <RewardCard key={reward.id} {...reward} />
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
