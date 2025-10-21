"use client";

import React from "react";
import { FaPlusSquare } from "react-icons/fa";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";
import IconCopy from "@/assets/icons/green-copy.svg";

export default function PageComponent() {
  return (
    <div className="flex flex-col gap-[27px] w-full md:p-0 p-[16px]">
      <div className="flex justify-end">
        <Chip color="danger" size="sm" className="bg-[#DE1111]">
          COMING SOON
        </Chip>
      </div>
      <div className="flex items-center gap-[18px] md:flex-row flex-col">
        <input
          type="text"
          className="my-input flex-1 md:w-[unset] w-full"
          placeholder="Search campaigns"
        />
        <button
          type="button"
          className="btn btn-primary gap-[12px] md:h-[unset] h-[36px] md:w-[unset] w-full"
        >
          New Campaign
          <FaPlusSquare size={16} />
        </button>
      </div>
      <Table
        aria-label="MyBets"
        className="overflow-x-auto"
        classNames={{
          th: "text-[9px] md:text-[14px] md:py-3 bg-[#222733]",
          td: "text-[10px] md:text-[14px] md:py-3 bg-[#222733]",
          tr: "border-b-1 border-[#FFFFFF0A]",
          wrapper: "bg-[#222733]",
        }}
      >
        <TableHeader>
          <TableColumn>Campaign name</TableColumn>
          <TableColumn>ID</TableColumn>
          <TableColumn>Campaign link</TableColumn>
          <TableColumn className="text-right">Signs Up</TableColumn>
          <TableColumn className="text-right">Earned</TableColumn>
        </TableHeader>
        <TableBody>
          {Array(1)
            .fill(0)
            .map((e, index) => (
              <TableRow key={index}>
                <TableCell>Casino.bet</TableCell>
                <TableCell>00000</TableCell>
                <TableCell>
                  <div className="flex items-center gap-[18px]">
                    https://www.Casino.com/?ref=Casino.bet-0000
                    <span>
                      <IconCopy />
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">0</TableCell>
                <TableCell className="text-right">$0.0</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
