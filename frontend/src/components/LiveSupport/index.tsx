"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

import IconOnlineLed from "@/assets/icons/online-led.svg";
import IconTip from "@/assets/icons/chat/tip.svg";
import IconRain from "@/assets/icons/chat/rain.svg";
import IconRule from "@/assets/icons/chat/rule.svg";
import IconChat from "@/assets/icons/chat/chat-icon.svg";

import styles from "./LiveSupport.module.scss";
import { useRecoilState } from "recoil";
import { chatExpandedState } from "@/state/chatExpandedState";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { MdClose } from "react-icons/md";
import Image from "next/image";
import ChatMessageInput from "./LiveSupportMessageInput";
import { liveSupportExpandedState } from "@/state/liveSupportExpandedState";
import { liveSupportMessagesState } from "@/state/liveSupportMessagesState";
import LiveSupportMessage from "./LiveSupportMessage";
import { apiGetMessages } from "@/api/chat/apiGetMessages";
import { apiGetConnectedUsers } from "@/api/chat/apiGetConnectedUsers";
import ChatRuleDialog from "../ChatRuleDialog";
import TransferBalanceDialog from "@/components/TransferBalanceDialog";
import { userState } from "@/state/userState";
import { apiGetSupportMessages } from "@/api/live_support/apiGetSupportMessages";
import { supportMessagesUnseenState } from "@/state/supportMessagesUnseenState";
import { apiSetSmUserCursor } from "@/api/live_support/apiSetSmUserCursor";

export default function LiveSupport() {
  const [liveSupportExpanded, setLiveSupportExpanded] = useRecoilState(
    liveSupportExpandedState
  );
  const [liveSupportMessages, setLiveSupportMessages] = useRecoilState(
    liveSupportMessagesState
  );
  const isMobile = useMediaQuery(mobileMediaQuery);
  const messagesEndRef = useRef(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [loggedUser] = useRecoilState(userState);
  const [smUnseenCount, setSmUnseenCount] = useRecoilState(
    supportMessagesUnseenState
  );

  useEffect(() => {
    (async () => {
      try {
        if (loggedUser) {
          const res = await apiGetSupportMessages(0, loggedUser.id);
          setLiveSupportMessages(res);
          const unseenMessagesCount = res.filter(
            (message) => message.id > loggedUser.smUserCursor
          ).length;
          setSmUnseenCount(unseenMessagesCount);
        } else {
          setLiveSupportMessages([]);
          setSmUnseenCount(0);
        }
      } catch (ex) {
        console.error(ex);
      }
    })();
  }, [loggedUser]);

  useEffect(() => {
    if (!divRef.current) {
      return;
    }

    divRef.current.scrollTo(
      0,
      divRef.current?.scrollHeight - divRef.current?.offsetHeight
    );
  }, [liveSupportMessages.length, liveSupportExpanded]);

  const resetUnseenCount = useCallback(() => {
    (async () => {
      if (liveSupportExpanded && loggedUser) {
        try {
          const lastSmId = liveSupportMessages.length - 1;
          const res = await apiSetSmUserCursor({
            userId: loggedUser?.id,
            cursor: liveSupportMessages[lastSmId].id,
          });
          if (res) {
            setSmUnseenCount(0);
          }
        } catch (ex) {
          console.log(ex);
        }
      }
    })();
  }, [liveSupportExpanded, setSmUnseenCount, liveSupportMessages, loggedUser]);

  useEffect(() => {
    resetUnseenCount();
  }, [liveSupportExpanded, resetUnseenCount]);
  return liveSupportExpanded ? (
    <section
      className={styles.container}
      style={{
        width: isMobile ? "100vw" : "300px",
      }}
    >
      <div className="flex p-[14px] items-center bg-[#1A1D26]">
        <h2 className="text-[#fff] font-semibold text-[16px] leading-[24px]">
          Live Support
        </h2>
        <div className="bg-[#272D3C] flex items-center px-[8px] py-[7px] gap-[5px] ml-[8px] mr-auto rounded-full">
          <IconOnlineLed />
        </div>
        <button
          className="flex items-center"
          type="button"
          onClick={() => setLiveSupportExpanded(false)}
        >
          <span className="text-[#BFC0C3] font-semibold text-[12px] leading-[27px] mr-[6px]">
            Close
          </span>
          <MdClose size={20} />
        </button>
      </div>
      <div
        className="bg-[#1C202A] flex-1 flex flex-col overflow-auto gap-[10px] p-[14px]"
        ref={divRef}
        // onScroll={() => {
        //   console.log({
        //     clientHeight: divRef.current?.clientHeight,
        //     offsetHeight: divRef.current?.offsetHeight,
        //     scrollHeight: divRef.current?.scrollHeight,
        //     scrollTop: divRef.current?.scrollTop,
        //   });
        // }}
      >
        {liveSupportMessages.map((e) => (
          <LiveSupportMessage key={e.id} data={e} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-[#222733] p-[14px] flex flex-col gap-[14px]">
        <ChatMessageInput />
      </div>
    </section>
  ) : (
    <button
      className={styles.expandButton}
      onClick={() => setLiveSupportExpanded(true)}
    >
      <IconChat />
      {smUnseenCount > 0 && <div className={styles.badge}>{smUnseenCount}</div>}
    </button>
  );
}