"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { isAddress } from "viem";
import { getToken } from "@wagmi/core";
import { wagmiConfig } from "@/provider/MyProvider";
import { tToken } from "@/types/tToken";
import BeatLoader from "react-spinners/BeatLoader";
import { toast } from "react-toastify";
import { apiGetToken } from "@/api/common/apiGetToken";
import { abbr } from "@/helpers/abbr";
import { numberRound } from "@/helpers/numberRound";
import { isValidSolAddress } from "@/helpers/isValidSolAddress";

interface SearchableSelectorProps {
  placeholder: string;
  items: tToken[];
  onSelectToken: (token: tToken) => void;
  chainId?: number;
}

export default function SearchableSelector({
  placeholder,
  items,
  onSelectToken,
  chainId,
}: SearchableSelectorProps) {
  const [keyword, setKeyword] = useState("");
  const [filtered, setFiltered] = useState<tToken[]>(items);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      // if (
      //   (chainId &&
      //     [1, 137, 56, 8453, 100, 43114, 250, 10, 42161].includes(chainId) &&
      //     isAddress(keyword.trim())) ||
      //   (chainId === 900 && isValidSolAddress(keyword.trim()))
      // ) {
      //   // search coin
      //   setFiltered([]);
      //   setLoading(true);
      //   try {
      //     // const token = await getToken(wagmiConfig, {
      //     //   address: keyword.trim() as `0x${string}`,
      //     //   chainId: chainId as any,
      //     // });

      //     const token = await apiGetToken(chainId, keyword.trim());
      //     setFiltered([
      //       {
      //         chainId,
      //         tokenIcon: token.tokenLogo,
      //         tokenAddress: keyword.trim(),
      //         tokenDecimals: +token.tokenDecimals,
      //         tokenName: token.tokenName,
      //         tokenSymbol: token.tokenSymbol,
      //         usdPrice: token.usdPrice,
      //         minimumLimit: numberRound(1 / token.usdPrice, 1000),
      //       },
      //     ]);
      //   } catch (ex) {}
      //   setLoading(false);
      // } else {
      const temp1 = items.filter((e) =>
        `${e.tokenName ?? ""}_${e.tokenSymbol ?? ""}`
          .toLowerCase()
          .includes(keyword.toLowerCase())
      );

      setFiltered(temp1);
      // }
    })();
  }, [keyword, items]);

  return (
    <div className="searchable-selector">
      <div className="search-box">
        <span className="icon">
          <FaSearch />
        </span>

        <input
          type="text"
          placeholder={placeholder}
          value={keyword}
          autoCapitalize="off"
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <ul className="list-box">
        {filtered.map((e) => (
          <li
            key={e.tokenName + e.tokenAddress}
            onClick={() => onSelectToken(e)}
          >
            <img
              src={e.tokenIcon || "/images/tokens/default-token.png"}
              alt={e.tokenName}
            />
            <span>
              {e.tokenName}
              {e.tokenName === e.tokenSymbol ? "" : ` (${e.tokenSymbol})`}
              &nbsp;&nbsp;
              {e.tokenAddress !== "0x" && `(${abbr(e.tokenAddress, 5)})`}
            </span>
          </li>
        ))}
        {loading && (
          <li className="loading">
            <BeatLoader color="var(--primary-color)" speedMultiplier={0.6} />
          </li>
        )}
      </ul>
    </div>
  );
}
