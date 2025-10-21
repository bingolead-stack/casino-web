"use client";

import React, { useState } from "react";
import styles from "./Page.module.scss";
import { Switch } from "@nextui-org/react";

export default function PageComponent() {
  return (
    <div className={styles.container}>
      <div className="flex flex-col rounded-[18px] border-1 border-[#FFFFFF0A] bg-[#1C202A]">
        <div className="border-b-[#FFFFFF0A] border-b-1 p-[28px] text-[24.8px] leading-[36px] font-semibold text-[#FFFFFF51]">
          Security
        </div>
        <div className="flex flex-row items-center  border-b-[#FFFFFF0A] border-b-1 p-[22.5px]">
          <div className="flex flex-col grow-[1]">
            <div className="text-[18px] leading-[27px] font-semibold text-[#FFFFFF]">
              Login Verification
            </div>
            <div className="text-[15.8px] leading-[27px] text-[#FFFFFF8E]">
              Require 2FA for log in
            </div>
          </div>
          <div>
            <Switch
              size="sm"
              className="p-0 m-0"
              color="success"
              // isSelected={false}
              // onValueChange={setViewInUsd}
            />
          </div>
        </div>
        <div className="flex flex-row items-center  border-b-[#FFFFFF0A] border-b-1 p-[22.5px]">
          <div className="flex flex-col grow-[1]">
            <div className="text-[18px] leading-[27px] font-semibold text-[#FFFFFF]">
              Password Change
            </div>
            <div className="text-[15.8px] leading-[27px] text-[#FFFFFF8E]">
              Require 2FA for changing password
            </div>
          </div>
          <div>
            <Switch
              size="sm"
              className="p-0 m-0"
              color="success"
              // isSelected={false}
              // onValueChange={setViewInUsd}
            />
          </div>
        </div>
        <div className="flex flex-row items-center  border-b-[#FFFFFF0A] border-b-1 p-[22.5px]">
          <div className="flex flex-col grow-[1]">
            <div className="text-[18px] leading-[27px] font-semibold text-[#FFFFFF]">
              Withdrawal
            </div>
            <div className="text-[15.8px] leading-[27px] text-[#FFFFFF8E]">
              Require 2FA for withdrawal
            </div>
          </div>
          <div>
            <Switch
              size="sm"
              className="p-0 m-0"
              color="success"
              // isSelected={false}
              // onValueChange={setViewInUsd}
            />
          </div>
        </div>
        <div className="flex flex-row items-center p-[22.5px]">
          <div className="flex flex-col grow-[1]">
            <div className="text-[18px] leading-[27px] font-semibold text-[#FFFFFF]">
              Rain and Tips
            </div>
            <div className="text-[15.8px] leading-[27px] text-[#FFFFFF8E]">
              Require 2FA to send Rain or Tips
            </div>
          </div>
          <div>
            <Switch
              size="sm"
              className="p-0 m-0"
              color="success"
              // isSelected={false}
              // onValueChange={setViewInUsd}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
