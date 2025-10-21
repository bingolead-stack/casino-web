"use client";

import React, { useState } from "react";
import styles from "./Page.module.scss";
import { Link } from "@/i18n/routing";
export default function PageComponent() {
  return (
    <div className={styles.container}>
      <div className="flex flex-col gap-[27px] px-[23.5px] pb-[23.5px] pt-[24.5px] rounded-[18px] border-1 border-[#FFFFFF0A] bg-[#1C202A]">
        <div className="flex flex-col gap-[10px]">
          <div className="text-[20.3px] text-[#fff] font-semibold text-[inner] leading-[27px]">
            Two-Factor Authentication{" "}
            <span className="text-[#FFFFFF8E]">(2FA)</span>
          </div>
          <div className="text-[15.8px] text-[#FFFFFF8E] font-semibold text-[inner] leading-[27px]">
            Enable 2-factor authentication to add a second layer of security to
            your account.
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row border-b-1 border-b-[#FFFFFF0A] rounded-t-[13.5px] bg-[#222733] p-[18px] justify-center items-center">
            <div className="flex-flex-col grow-[1]">
              <div className="text-[18px] text-[#fff] font-semibold text-[inner]  leading-[27px]">
                Authenticator app{" "}
                <span className="text-[#FFFFFF8E]">(Recommended)</span>
              </div>
              <div className="text-[15.8px] text-[#FFFFFF8E]  text-[inner] leading-[27px]">
                Examples: Google Authenticator, iOS authenticator, etc
              </div>
            </div>
            <Link
              className="border-1 border-[#FFFFFF11] text-[15.8px] text-[#7FEB6B] font-semibold text-[inner] bg-[#1C202A] py-[13px] px-[14.5px] rounded-[9px]  leading-[27px]"
              href={"/"}
            >
              Enable
            </Link>
          </div>
          <div className="flex flex-row  rounded-b-[13.5px] bg-[#222733] p-[18px] items-center leading-[27px]">
            <div className="flex flex-col grow-[1]">
              <div className="text-[18px] text-[#fff] font-semibold text-[inner]">
                Email
              </div>
              <div className="text-[15.8px] text-[#FFFFFF8E]  text-[inner]">
                Get a code sent to your email
              </div>
            </div>
            <Link
              className="border-1 border-[#FFFFFF11] text-[15.8px] text-[#7FEB6B] font-semibold text-[inner] bg-[#1C202A] py-[13px] px-[14.5px] rounded-[9px]"
              href={"/"}
            >
              Enable
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-[27px] px-[23.5px] pb-[23.5px] pt-[24.5px] rounded-[18px] border-1 border-[#FFFFFF0A] bg-[#1C202A]">
        <div className="flex flex-row items-center">
          <div className="grow-[1] text-[20.3px] text-[#fff] font-semibold text-[inner]">Change Password</div>
          <Link
            className="border-1 border-[#FFFFFF11] text-[15.8px] text-[#7FEB6B] font-semibold text-[inner] bg-[#1C202A] py-[13px] px-[14.5px] rounded-[9px]"
            href={"/"}
          >
            Change password
          </Link>
        </div>
      </div>
    </div>
  );
}
