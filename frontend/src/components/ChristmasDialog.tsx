"use client";

import React, { useMemo } from "react";
import { Modal, ModalContent, ModalBody } from "@nextui-org/react";

interface ChristmasDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const images = [
];

export default function ChristmasDialog({
  isOpen,
  onClose,
}: ChristmasDialogProps) {
  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent className="max-w-[800px]">
        <ModalBody className="p-0 flex flex-col items-center relative justify-center">
          <img src={images[0]} className="object-cover w-full" />
          <div className="absolute flex flex-col items-center md:px-[100px] px-[20px]">
            <div
              className="text-[#ff0] md:text-[64px] text-[40px] font-bold"
              style={{ fontFamily: "Dancing Script" }}
            >
              Merry Christmas
            </div>
            <div
              className="text-[#ff0] text-[40px] font-bold text-center md:block hidden"
              style={{ fontFamily: "Dancing Script" }}
            >
              Wish you have a nice holidays and winning games in Casino.bet
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
