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
import { apiGetPaymentTransaction } from "@/api/transaction/apiGetPaymentTransaction.ts";
import { allChainsMap } from "@/config/chains";
import { abbr } from "@/helpers/abbr";
import { numberRound } from "@/helpers/numberRound";
import TextWithCopy from "@/components/TextWithCopy";
import { tokenListState } from "@/state/tokenListState";
import { stringToColor } from "@/helpers/stringToColor";

const chipColors: { [eventType: string]: string } = {
  Win: "success",
  Lose: "danger",
  BetPlacing: "primary",
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
  const [tokenList, setTokenList] = useRecoilState(tokenListState);
  // const [period, setPeriod] = useState({
  //   start: new CalendarDate(today.getFullYear(), today.getMonth() + 1, 1),
  //   end: new CalendarDate(
  //     today.getFullYear(),
  //     today.getMonth() + 1,
  //     today.getDate()
  //   ),
  // });

  const { type }: { type: string } = useParams();

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    (async () => {
      setLoading(true);

      try {
        const res = await apiGetPaymentTransaction({
          offset: (currentPage - 1) * 10,
          length: 10,
          type,
        });
        setData(res.data);
        setTotal(res.total);
      } catch (ex) {
        console.error(ex);
      }

      setLoading(false);
    })();
  }, [currentPage, type, user?.id]);

  return (
    <div className="p-[16px] md:p-0">
      <div className="flex flex-col md:gap-[27px] gap-[16px]">
        {loading ? (
          <Loader />
        ) : data.length > 0 ? (
          <Table
            aria-label="MyBets"
            classNames={{
              th: "text-[9px] md:text-[14px] md:py-3 bg-[#222733]",
              td: "text-[10px] md:text-[14px] md:py-3 bg-[#222733]",
              tr: "border-b-1 border-[#FFFFFF0A]",
              wrapper: "bg-[#222733]",
            }}
          >
            <TableHeader>
              <TableColumn>Time</TableColumn>
              <TableColumn>Type</TableColumn>
              <TableColumn>Assets</TableColumn>
              <TableColumn
                className="text-right"
                hidden={!(type === "deposit" || type === "withdrawal")}
              >
                Amount
              </TableColumn>
              <TableColumn className="text-right">USD</TableColumn>
              <TableColumn>TxID</TableColumn>
              <TableColumn>Status</TableColumn>
            </TableHeader>
            <TableBody>
              {data.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="whitespace-nowrap">
                    {moment(e.createdAt).format("DD MMM, YYYY, hh:mm A")}
                  </TableCell>
                  <TableCell>
                    <span
                      className="text-white rounded-full p-2 text-[12px]"
                      style={{
                        background: stringToColor(e.platform),
                      }}
                    >
                      {e.io > 0 ? "+" : "-"}&nbsp;
                      {e.platform}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-[12px] flex items-center gap-2">
                      {
                        tokenList.find((t) => t.dbField === e.tokenName)
                          ?.tokenSymbol
                      }
                      <img
                        className="w-[16px] h-[16px]"
                        src={
                          tokenList.find((t) => t.dbField === e.tokenName)
                            ?.tokenIcon
                        }
                        alt="token"
                      />
                    </div>
                  </TableCell>
                  <TableCell
                    className="text-right text-[#FFF]"
                    hidden={!(type === "deposit" || type === "withdrawal")}
                  >
                    {numberRound(e.tokenAmount, 100000)}
                  </TableCell>
                  <TableCell className="text-right text-[#FFF]">
                    ${numberRound(e.cash, 100)}
                  </TableCell>
                  <TableCell>
                    <TextWithCopy
                      text={
                        (type === "deposit" || type === "withdrawal"
                          ? e.txHash
                          : e.id) || ""
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Chip size="sm">Completed</Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="rounded-[12px] flex items-center justify-center bg-[#222733] h-[400px] flex-col gap-[30px]">
            <div className="bg-[#1C202A] rounded-[16px] w-[72px] h-[72px] flex items-center justify-center">
              <IconBall />
            </div>
            <div className="text-[18px] leading-[27px] text-[#FFFFFF8E]">
              You don&apos;t have any transactions.
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
