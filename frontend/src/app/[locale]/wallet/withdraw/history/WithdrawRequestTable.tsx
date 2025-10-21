"use client";

import React, { useCallback, useEffect, useState } from "react";
import Loader from "@/components/Loader";
import {
  Pagination,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
} from "@nextui-org/react";

import moment from "moment";
import { abbr } from "@/helpers/abbr";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { apiGetLazyWithdraws } from "@/api/wallet/apiGetLazyWithdraws";
import { tWithdrawRequest } from "@/types/tWithdrawRequest";
import { addressLink } from "@/helpers/addressLink";
import { Link } from "@/i18n/routing";
import { allChainsMap } from "@/config/chains";
import { toast } from "react-toastify";
import { apiCancelLazyWithdraw } from "@/api/wallet/apiCancelLazyWithdraw";
import { useRecoilState } from "recoil";
import { userState } from "@/state/userState";

const statusChips = [
  {
    color: "default",
    text: "Pending",
  },
  {
    color: "success",
    text: "Approved",
  },
  {
    color: "danger",
    text: "Banned",
  },
  {
    color: "default",
    text: "Canceled",
  },
];

export default function WithdrawRequestTable() {
  const [data, setData] = useState<tWithdrawRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    if (user?.id) {
      (async () => {
        setLoading(true);

        try {
          const res = await apiGetLazyWithdraws((currentPage - 1) * 10, 10);
          setData(res.data);
          setTotal(res.total);
        } catch (ex) {
          console.error(ex);
        }

        setLoading(false);
      })();
    }
  }, [currentPage, user?.id]);

  const onCancelRequest = useCallback(
    async (requestId: number) => {
      if (user?.id) {
        try {
          const balance = await apiCancelLazyWithdraw(requestId);
          setUser((p) =>
            p
              ? {
                  ...p,
                  cash: balance.cash,
                  bonus: balance.bonus,
                  locked: balance.locked,
                }
              : p
          );

          setData((p) => {
            const i = p.findIndex((e) => e.id === requestId);
            if (i !== -1) {
              const newData = [...p];
              newData[i].status = 3;
              return newData;
            }
            return p;
          });
        } catch (ex) {
          toast.error("Something went wrong in canceling");
        }
      }
    },
    [user?.id]
  );

  return (
    <div className="mb-4">
      <div>
        <div className="flex items-center justify-between md:flex-row flex-col gap-2 p-4">
          <div className="flex text-[12px]">Withdraw History: {total}</div>
          <Pagination
            showControls
            total={Math.ceil(total / 10)}
            color="success"
            radius="full"
            page={currentPage}
            onChange={setCurrentPage}
            isCompact
          />
        </div>
        {loading ? (
          <Loader />
        ) : (
          <Table removeWrapper aria-label="Users" className="p-4">
            <TableHeader>
              <TableColumn>Id</TableColumn>
              <TableColumn>Chain</TableColumn>
              <TableColumn>Address</TableColumn>
              <TableColumn>Cash</TableColumn>
              <TableColumn hidden={isMobile}>Created At</TableColumn>
              <TableColumn hidden={isMobile}>Issued At</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>&nbsp;</TableColumn>
            </TableHeader>
            <TableBody>
              {data.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="text-[12px]">{e.id}</TableCell>
                  <TableCell className="text-[12px]">
                    <div className="flex items-center gap-2">
                      <img
                        className="w-[16px] h-[16px]"
                        src={allChainsMap[e.chainId]?.icon}
                        alt={allChainsMap[e.chainId]?.name}
                      />
                      {allChainsMap[e.chainId]?.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-[12px]">
                    <Link
                      href={addressLink(e.address, e.chainId)}
                      className="hover:underline"
                    >
                      {abbr(e.address, isMobile ? 2 : 5)}
                    </Link>
                  </TableCell>
                  <TableCell className="text-[12px]">{e.cash}</TableCell>
                  <TableCell className="text-[12px]" hidden={isMobile}>
                    {moment(e.createdAt).format("YYYY-MM-DD HH:mm")}
                  </TableCell>
                  <TableCell className="text-[12px]" hidden={isMobile}>
                    {e.issuedAt
                      ? moment(e.issuedAt).format("YYYY-MM-DD HH:mm")
                      : ""}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={statusChips[e.status || 0]?.color as any}
                      size="sm"
                      className="text-[10px]"
                    >
                      {statusChips[e.status || 0]?.text}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {e.status === 0 && (
                      <Button size="sm" onClick={() => onCancelRequest(e.id)}>
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
