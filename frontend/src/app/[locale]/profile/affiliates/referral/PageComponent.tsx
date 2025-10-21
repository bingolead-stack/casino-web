"use client";

import React, { useEffect, useState } from "react";
import {
  Pagination,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";
import { useRecoilState } from "recoil";
import { userState } from "@/state/userState";
import moment from "moment";
import {
  apiGetReferredUsers,
  tReferredUsers,
} from "@/api/referral/apiGetReferredUsers";

export default function PageComponent() {
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [user] = useRecoilState(userState);
  const [data, setData] = useState<tReferredUsers[]>([]);

  useEffect(() => {
    if (user?.id) {
      (async () => {
        setLoading(true);

        try {
          const res = await apiGetReferredUsers({
            offset: (currentPage - 1) * 10,
            length: 10,
          });
          setData(res.data);
          setTotal(res.total);
        } catch (ex) {
          console.error(ex);
        }

        setLoading(false);
      })();
    }
  }, [currentPage, user?.id]);

  return (
    <div className="flex flex-col gap-[27px] w-full md:p-0 p-[16px]">
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
          <TableColumn>Joined At</TableColumn>
          <TableColumn>Player Name</TableColumn>
          <TableColumn>Player Email</TableColumn>
          <TableColumn>Lost</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((e) => (
            <TableRow key={e.id}>
              <TableCell>
                {moment(e.createdAt).format("YYYY-MM-DD hh:mm A")}
              </TableCell>
              <TableCell>{e.userName}</TableCell>
              <TableCell>{e.email}</TableCell>
              <TableCell>
                {e.profit < 0 ? -e.profit : e.profit > 0 ? "Win" : 0}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center">
        <Pagination
          showControls
          total={Math.ceil(total / 10)}
          color="success"
          radius="full"
          page={currentPage}
          onChange={setCurrentPage}
          isCompact
          classNames={{
            item: "text-[12px] md:text-[14px] bg-[#222733]",
            prev: "bg-[#222733]",
            next: "bg-[#222733]",
            cursor: "bg-[var(--primary-color)]",
          }}
        />
      </div>
    </div>
  );
}
