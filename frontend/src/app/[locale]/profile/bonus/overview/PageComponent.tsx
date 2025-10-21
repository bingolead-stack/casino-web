"use client";

import React, { useState } from "react";
import styles from "./Page.module.scss";
import { Chip } from "@nextui-org/react";
import { FaWallet } from "react-icons/fa";
import { useRecoilState } from "recoil";
import { userState } from "@/state/userState";

export default function PageComponent() {
  const [user] = useRecoilState(userState);

  return (
    <div className="flex flex-col gap-[27px]">
      <div className={styles.container}>
        <div className={styles.title}>
          <div className={styles.titleText}>
            <h5>Bonus</h5>
            <div>Bonus overview</div>
          </div>
        </div>
        <div className={styles.content}>
          <Chip color="danger" size="sm">
            Coming soon
          </Chip>
        </div>
      </div>
    </div>
  );
}
