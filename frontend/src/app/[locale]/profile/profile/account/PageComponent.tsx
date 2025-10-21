"use client";

import React, { useState } from "react";
import styles from "./Page.module.scss";
import { Chip } from "@nextui-org/react";
import { FaPen, FaWallet } from "react-icons/fa";
import { useRecoilState } from "recoil";
import { userState } from "@/state/userState";
import VIPLevelChip from "@/components/VIPLevelChip";
import ChangeAvatarDialog from "./ChangeAvatarDialog";

export default function PageComponent() {
  const [user] = useRecoilState(userState);
  const [openChangeAvatar, setOpenChangeAvatar] = useState(false);

  return (
    <div className="flex flex-col gap-[27px]">
      <div className={styles.container}>
        <div className={styles.title}>
          <div className={styles.titleText}>
            <h5>Profile</h5>
            <div>User Information</div>
          </div>
        </div>
        <div className={styles.content}>
          <div className="flex gap-[27px] items-center">
            <div className="relative">
              <img
                src={user?.avatar || "/images/default-avatar.png"}
                className="w-[90px] h-[90px] rounded-full"
                alt={user?.userName}
              />
              <button
                className="w-[36px] h-[36px] rounded-full bg-[#222733] hover:bg-[#333744] flex items-center justify-center absolute bottom-0 right-0"
                type="button"
                onClick={() => setOpenChangeAvatar(true)}
              >
                <FaPen />
              </button>
            </div>
            <div className="flex flex-col gap-[5px]">
              <span className="text-[30px] leading-[45px] text-[#FFF] font-bold">
                {user?.userName}
              </span>
              <div>
                <VIPLevelChip level={user?.vipLevel || 0} />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[#FFFFFF8E] text-[16px] leading-[27px] font-medium">
              Email
            </span>
            <input
              type="text"
              className="my-input md:w-[50%] w-full"
              placeholder="Enter new email"
            />
          </div>
          <div className="flex items-center gap-[10px]">
            <button className="btn btn-primary">Verify Email</button>
            <Chip color="danger" size="sm">
              Coming soon
            </Chip>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.title}>
          <div className={styles.titleText}>
            <h5>Wallets</h5>
            <div>You can add up to 5 wallets.</div>
          </div>
          <button type="button" className="btn btn-primary gap-[9px]">
            Link Wallet
            <FaWallet />
          </button>
        </div>
        <div className={styles.content}>
          <Chip color="danger" size="sm">
            Coming soon
          </Chip>
        </div>
      </div>

      <ChangeAvatarDialog
        isOpen={openChangeAvatar}
        onClose={() => setOpenChangeAvatar(false)}
      />
    </div>
  );
}
