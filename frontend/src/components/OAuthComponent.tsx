import React from "react";
import IconGoogle from "@/assets/icons/login/google.svg";
import IconTelegram from "@/assets/icons/login/telegram.svg";
import IconDiscord from "@/assets/icons/login/discord.svg";
import IconPhantom from "@/assets/icons/login/phantom.svg";
import IconMetamask from "@/assets/icons/login/metamask.svg";
import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";

export const OAuthComponent: React.FC = () => {
  return (
    <div className="flex h-[45px] gap-[9px] items-center">
      <button type="button" className="login-with-button">
        <IconGoogle />
      </button>
      <button type="button" className="login-with-button">
        <IconTelegram />
      </button>
      <button type="button" className="login-with-button">
        <IconDiscord />
      </button>
      <div className="w-[1px] h-[36px] bg-[#FFFFFF11]" />
      <div className="w-[180px] flex h-full">
        <button type="button" className="login-with-button flex-1">
          Wallets
          <div className="flex gap-[4px] items-center">
            <IconPhantom />
            <IconMetamask />
            <Image
              src="/images/rainbow.png"
              alt="rainbow"
              width={16}
              height={16}
            />
          </div>
          <FaChevronRight size={12} />
        </button>
      </div>
    </div>
  );
};
