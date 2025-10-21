"use client";

import React, { useEffect, useState } from "react";
import SearchableSelector from "./SearchableSelector";
import BuyCrypto from "./BuyCrypto";
import DepositDialog from "./DepositDialog";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { allChains } from "@/config/chains";
import { tChain } from "@/types/tChain";
import { tToken } from "@/types/tToken";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery, supportingChainIds } from "@/config/constants";
import { useRecoilState } from "recoil";
import { userState } from "@/state/userState";
import LoginRequest from "@/components/LoginRequest";
import { apiGetTokenList } from "@/api/common/apiGetTokenList";

export default function Deposit() {
  const [open, setOpen] = useState(false);
  const [chain, setChain] = useState<tChain>();
  const [token, setToken] = useState<tToken>();
  const isMobile = useMediaQuery(mobileMediaQuery);
  const [user] = useRecoilState(userState);
  const [tokens, setTokens] = useState<tToken[]>([]);

  const onSelectToken = (t: tToken) => {
    setToken(t);
    setOpen(true);
  };

  useEffect(() => {
    (async () => {
      if (user?.id) {
        try {
          const tokens1 = await apiGetTokenList(0);
          setTokens(tokens1);
        } catch (ex) {
          console.error(ex);
        }
      }
    })();
  }, [user?.id]);

  if (!user?.id) {
    return <LoginRequest />;
  }

  return (
    <div className="deposit">
      <div className="deposit-container">
        <div className="popular-networks">
          <div className="section-label">Supported Networks</div>
          <Swiper
            modules={[Navigation]}
            className="networks"
            spaceBetween={8}
            navigation
            slidesPerView={isMobile ? 4.2 : 5}
          >
            {allChains
              .filter((e) => supportingChainIds.includes(e.chainId))
              .map((e) => (
                <SwiperSlide
                  key={e.name}
                  className={`network ${
                    chain?.chainId === e.chainId ? "selected" : ""
                  }`}
                  onClick={() => setChain(e)}
                >
                  <img src={e.icon} alt={e.name} />
                  <span>{e.name}</span>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
        <div className="all-networks">
          <div className="section-label">All Networks</div>
          <SearchableSelector
            placeholder="Make it easy, try to search"
            items={tokens.filter((t) => t.chainId === chain?.chainId)}
            onSelectToken={onSelectToken}
            chainId={chain?.chainId}
          />
        </div>
        <BuyCrypto />
      </div>
      <DepositDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        token={token}
      />
    </div>
  );
}
