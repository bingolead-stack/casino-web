"use client";

import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import {
  Pagination,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  DateRangePicker,
  Chip,
} from "@nextui-org/react";
import moment from "moment";
import { tTransaction } from "@/types/tTransaction";
import { getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { apiGetCasinoTransaction } from "@/api/transaction/apiGetCasinoTransaction";
import { userState } from "@/state/userState";
import { useRecoilState } from "recoil";
import LoginRequest from "@/components/LoginRequest";

const today = new Date();

const chipColors: { [eventType: string]: string } = {
  Win: "success",
  Lose: "danger",
  BetPlacing: "primary",
  BetPlacingAbort: "danger",
};

export default function MyBetsPage() {
  const [user] = useRecoilState(userState);
  const [data, setData] = useState<tTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const [period, setPeriod] = useState({
    start: new CalendarDate(today.getFullYear(), today.getMonth() + 1, 1),
    end: new CalendarDate(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    ),
  });

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const res = await apiGetCasinoTransaction({
          offset: (currentPage - 1) * 10,
          length: 10,
          startDate: period.start.toDate(getLocalTimeZone()).getTime(),
          endDate:
            period.end.toDate(getLocalTimeZone()).getTime() + 86400000 - 1,
        });
        setData(res.data);
        setTotal(res.total);
      } catch (ex) {
        console.error(ex);
      }

      setLoading(false);
    })();
  }, [currentPage, period.start, period.end]);

  if (!user?.id) {
    return <LoginRequest />;
  }

  return (
    <div className="p-[16px] md:p-0">
      <div className="flex items-center mb-4 justify-between flex-col md:flex-row gap-4">
        <h1 className="text-[var(--primary-color)] uppercase font-bold text-[20px]">
          Casino History
        </h1>

        <DateRangePicker
          label="Select period"
          className="md:w-[300px] w-full"
          value={period}
          onChange={setPeriod}
          visibleMonths={isMobile ? 1 : 3}
        />
      </div>
      <div>
        <div className="flex items-center justify-between md:flex-row flex-col gap-2 mb-2">
          <div className="flex text-[12px]">Total History: {total} items</div>
          <Pagination
            showControls
            total={Math.ceil(total / 10)}
            color="success"
            radius="full"
            page={currentPage}
            onChange={setCurrentPage}
            isCompact
            classNames={{
              item: "text-[12px] md:text-[14px]",
            }}
          />
        </div>
        {loading ? (
          <Loader />
        ) : (
          <Table
            removeWrapper
            aria-label="MyBets"
            classNames={{
              th: "text-[9px] md:text-[14px] md:py-3",
              td: "text-[10px] md:text-[14px] md:py-3",
            }}
          >
            <TableHeader>
              <TableColumn>No</TableColumn>
              <TableColumn>Game</TableColumn>
              <TableColumn>Type</TableColumn>
              <TableColumn>Amount</TableColumn>
              <TableColumn>Date</TableColumn>
            </TableHeader>
            <TableBody>
              {data.map((e, index) => (
                <TableRow key={e.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {e.context?.game?.name || ""}
                  </TableCell>
                  <TableCell>
                    <Chip
                      className="text-[10px] md:text-[14px] p-1 wrap"
                      size="sm"
                      color={
                        (chipColors[e.eventType || ""] as any) || "default"
                      }
                    >
                      {e.eventType}
                    </Chip>
                  </TableCell>
                  <TableCell>{e.cash}</TableCell>
                  <TableCell>
                    {moment(e.createdAt).format("YYYY-MM-DD hh:mm A")}
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
