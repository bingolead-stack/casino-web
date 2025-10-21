"use client";

import React, { useState } from "react";
import styles from "./Page.module.scss";
import { Link } from "@/i18n/routing";
import { FaChevronUp } from "react-icons/fa";
import { Radio, RadioGroup } from "@nextui-org/react";
// import {RadioGroup, Radio} from "@nextui/react";
export default function PageComponent() {
  return (
    <div className={styles.container}>
      <div className="bg-[#1C202A] border-1 border-[#FFFFFF0A] flex flex-col">
        <div className="p-[22.5px] flex flex-row">
          <div className="grow-[1] font-semibold text-[24.8px] leading-[36px] font-[inter] text-[#FFFFFF8E]">
            Level 1
          </div>
          <button className="p-[6.75px] rounded-[6px] bg-[#222733]">
            <FaChevronUp size={22.5} className="p-[6.75px]" />
          </button>
        </div>
        <div className="flex flex-row px-[23.5px] py-[28px] border-t-1 border-t-[#FFFFFF0A]">
          <div className="md:grid md:grid-cols-2 md:gap-x-[9px] md:gap-y-[35.5px] flex flex-col gap-[18px]">
            <div className="flex flex-col gap-[4.5px]">
              <div className="font-medium font-[inter] text-[15.8px] leading-[27px] text-[#FFFFFF8E]">
                First name <span className="text-[#F68989]">*</span>
              </div>
              <input className="my-input" placeholder="Colby" />
            </div>
            <div className="flex flex-col gap-[4.5px]">
              <div className="font-medium font-[inter] text-[15.8px] leading-[27px] text-[#FFFFFF8E]">
                Last name <span className="text-[#F68989]">*</span>
              </div>
              <input className="my-input" placeholder="Brown" />
            </div>
            <div className="flex flex-col gap-[4.5px]">
              <div className="font-medium font-[inter] text-[15.8px] leading-[27px] text-[#FFFFFF8E]">
                Date of birth <span className="text-[#F68989]">*</span>
              </div>
              <input type="date" className="my-input" placeholder="Colby" />
            </div>
            <div className="flex flex-col gap-[4.5px]">
              <div className="font-medium font-[inter] text-[15.8px] leading-[27px] text-[#FFFFFF8E]">
                City <span className="text-[#F68989]">*</span>
              </div>
              <input className="my-input" placeholder="New York" />
            </div>
            <div className="flex flex-col gap-[4.5px] col-span-2">
              <div className="font-medium font-[inter] text-[15.8px] leading-[27px] text-[#FFFFFF8E]">
                Residential Address <span className="text-[#F68989]">*</span>
              </div>
              <textarea
                className={styles.myArea}
                placeholder="55 East 10th Street, New York, NY 10003"
              ></textarea>
            </div>
            <div className="flex flex-col gap-[4.5px]">
              <div className="font-medium font-[inter] text-[15.8px] leading-[27px] text-[#FFFFFF8E]">
                Postal Code
              </div>
              <input className="my-input" placeholder="10003" />
            </div>
            <div className="flex flex-col gap-[4.5px]">
              <div className="font-medium font-[inter] text-[15.8px] leading-[27px] text-[#FFFFFF8E]">
                Country <span className="text-[#F68989]">*</span>
              </div>
              <input className="my-input" placeholder="Canada" />
            </div>
            <div className="flex flex-col gap-[18px] col-span-2">
              <div className="font-medium font-[inter] text-[15.8px] leading-[27px] text-[#FFFFFF8E]">
                Gender
              </div>
              <RadioGroup orientation="horizontal" className="flex gap-[27px]">
                <Radio value="Male" checked color="success">
                  Male
                </Radio>
                <Radio value="Female" color="success">
                  Female
                </Radio>
              </RadioGroup>
            </div>
            <div>
              <button className="btn btn-primary">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
