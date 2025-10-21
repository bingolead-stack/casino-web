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
  Chip,
} from "@nextui-org/react";
import moment from "moment";
import { tTransaction } from "@/types/tTransaction";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { apiGetCasinoTransaction } from "@/api/transaction/apiGetCasinoTransaction";
import { userState } from "@/state/userState";
import { useRecoilState } from "recoil";
import { useParams } from "next/navigation";
import { apiGetSportsbookTransaction } from "@/api/transaction/apiGetSportsbookTransaction";
import IconBall from "@/assets/icons/ball.svg";
import TextWithCopy from "@/components/TextWithCopy";

const chipColors: { [eventType: string]: string } = {
  Win: "success",
  win: "success",
  Lose: "danger",
  BetPlacing: "primary",
  bet: "primary",
  BetPlacingAbort: "danger",
  deposit: "primary",
  withdrawal: "success",
};

export default function PageComponent() {
  const [user] = useRecoilState(userState);
  const [data, setData] = useState<tTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useMediaQuery(mobileMediaQuery);
  // const [period, setPeriod] = useState({
  //   start: new CalendarDate(today.getFullYear(), today.getMonth() + 1, 1),
  //   end: new CalendarDate(
  //     today.getFullYear(),
  //     today.getMonth() + 1,
  //     today.getDate()
  //   ),
  // });

  const { game }: { game: string } = useParams();

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    (async () => {
      setLoading(true);

      try {
        if (game === "casino") {
          const res = await apiGetCasinoTransaction({
            offset: (currentPage - 1) * 10,
            length: 10,
            // startDate: period.start.toDate(getLocalTimeZone()).getTime(),
            // endDate:
            //   period.end.toDate(getLocalTimeZone()).getTime() + 86400000 - 1,
          });
          setData(res.data);
          setTotal(res.total);
        } else {
          const res = await apiGetSportsbookTransaction({
            offset: (currentPage - 1) * 10,
            length: 10,
            // startDate: period.start.toDate(getLocalTimeZone()).getTime(),
            // endDate:
            //   period.end.toDate(getLocalTimeZone()).getTime() + 86400000 - 1,
          });
          setData(res.data);
          setTotal(res.total);
        }
      } catch (ex) {
        console.error(ex);
      }

      setLoading(false);
    })();
  }, [currentPage, game, user?.id]);

  return (
    <div className="p-[16px] md:p-0 flex flex-col w-full">
      {/* <div className="flex items-center mb-4 justify-between flex-col md:flex-row gap-4">
        <h1 className="text-[var(--primary-color)] uppercase font-bold text-[20px]">
          {game} History
        </h1>

        <DateRangePicker
          label="Select period"
          className="md:w-[300px] w-full"
          value={period}
          onChange={setPeriod}
          visibleMonths={isMobile ? 1 : 3}
          classNames={{
            inputWrapper: "bg-[#222733] focus-within:hover:bg-[#222733]"
          }}
        />
      </div> */}
      <div className="flex flex-col md:gap-[27px] gap-[16px]">
        {loading ? (
          <Loader />
        ) : data.length > 0 ? (
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
              <TableColumn>BetID</TableColumn>
              <TableColumn hidden={game !== "casino"}>Game</TableColumn>
              <TableColumn hidden={game !== "casino"}>Provider</TableColumn>
              <TableColumn>Type</TableColumn>
              <TableColumn>Amount</TableColumn>
              <TableColumn>Date</TableColumn>
            </TableHeader>
            <TableBody>
              {data.map((e, index) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <TextWithCopy text={e.id} />
                  </TableCell>
                  <TableCell hidden={game !== "casino"}>
                    {e.context?.game?.name || ""}
                  </TableCell>
                  <TableCell hidden={game !== "casino"}>{e.provider}</TableCell>
                  <TableCell>
                    {game === "casino" ? (
                      <Chip
                        className="text-[10px] md:text-[14px] p-1 wrap"
                        size="sm"
                        color={
                          (chipColors[e.eventType || ""] as any) || "default"
                        }
                      >
                        {e.eventType}
                      </Chip>
                    ) : (
                      <Chip
                        className="text-[10px] md:text-[14px] p-1 wrap"
                        size="sm"
                        color={(chipColors[e.type || ""] as any) || "default"}
                      >
                        {e.type === "deposit" ? "Paid Out" : "BetPlacing"}
                      </Chip>
                    )}
                  </TableCell>
                  <TableCell>{e.cash}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {moment(e.createdAt).format("DD MMM, YYYY, hh:mm A")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="rounded-[12px] flex items-center justify-center bg-[#222733] h-[400px] flex-col gap-[30px] p-[16px]">
            <div className="bg-[#1C202A] rounded-[16px] w-[72px] h-[72px] flex items-center justify-center">
              <IconBall />
            </div>
            <div className="text-[18px] leading-[27px] text-[#FFFFFF8E] text-center">
              You don&apos;t have any active {game} bets. Start playing now.
            </div>
          </div>
        )}
        {data.length > 0 && (
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
                item: "text-[12px] md:text-[14px] bg-[#222733]",
                prev: "bg-[#222733]",
                next: "bg-[#222733]",
                cursor: "bg-[var(--primary-color)]",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
