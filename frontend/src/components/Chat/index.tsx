"use client";

import React, { useEffect, useRef, useState } from "react";

import IconOnlineLed from "@/assets/icons/online-led.svg";
import IconTip from "@/assets/icons/chat/tip.svg";
import IconRule from "@/assets/icons/chat/rule.svg";
import IconChat from "@/assets/icons/chat/chat-icon.svg";

import styles from "./Chat.module.scss";
import { useRecoilState } from "recoil";
import { chatExpandedState } from "@/state/chatExpandedState";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { MdClose } from "react-icons/md";
import Image from "next/image";
import ChatMessageInput from "./ChatMessageInput";
import { chatMessagesState } from "@/state/chatMessagesState";
import ChatMessage from "./ChatMessage";
import { apiGetMessages } from "@/api/chat/apiGetMessages";
import { apiGetConnectedUsers } from "@/api/chat/apiGetConnectedUsers";
import ChatRuleDialog from "../ChatRuleDialog";
import TransferBalanceDialog from "@/components/TransferBalanceDialog";

export default function Chat() {
  const [chatExpanded, setChatExpanded] = useRecoilState(chatExpandedState);
  const [chatMessages, setChatMessages] = useRecoilState(chatMessagesState);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const messagesEndRef = useRef(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [ruleOpen, setRuleOpen] = useState(false);
  const [transferOpened, setTransferOpened] = useState(false);
  const [chatLastReadIndexState, setChatLastReadIndexState] = useState(0);

  useEffect(() => {
    if (chatExpanded) {
      setTimeout(() => {
        if (divRef.current) {
          divRef.current.scrollTo(
            0,
            divRef.current?.scrollHeight - divRef.current?.offsetHeight
          );
        }
        setChatLastReadIndexState(chatMessages.length);
      }, 300);
    } else {
    }
  }, [chatExpanded, chatMessages.length]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGetMessages(0);
        setChatMessages(res);
      } catch (ex) {
        console.error(ex);
      }
    })();

    let timeoutId: NodeJS.Timeout;
    const loadConnectedUsers = async () => {
      try {
        const res = await apiGetConnectedUsers();
        setConnectedUsers(res);
      } catch (ex) {
        console.error(ex);
      }

      timeoutId = setTimeout(loadConnectedUsers, 10000);
    };

    loadConnectedUsers();
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!divRef.current) {
      return;
    }

    divRef.current.scrollTo(
      0,
      divRef.current?.scrollHeight - divRef.current?.offsetHeight
    );
  }, [chatMessages.length]);

  return chatExpanded ? (
    <section
      className={styles.container}
      style={{
        width: isMobile ? "100vw" : "300px",
      }}
    >
      <div className="flex p-[14px] items-center bg-[#1A1D26]">
        <h2 className="text-[#fff] font-semibold text-[16px] leading-[24px]">
          Chat
        </h2>
        <div className="bg-[#272D3C] flex items-center px-[8px] py-[7px] gap-[5px] ml-[8px] mr-auto rounded-full">
          <IconOnlineLed />
          <span className="text-[#FFFFFF8E] font-semibold text-[14px] leading-[18px]">
            {connectedUsers.length}
          </span>
        </div>
        <button
          className="flex items-center"
          type="button"
          onClick={() => setChatExpanded(false)}
        >
          <span className="text-[#BFC0C3] font-semibold text-[12px] leading-[27px] mr-[6px]">
            Close Chat
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
        {chatMessages.map((e, index) => (
          <ChatMessage
            key={e.id}
            data={e}
            sameUser={
              e.User?.id === chatMessages[index - 1]?.User?.id &&
              Math.abs(
                new Date(e.createdAt).getTime() -
                  new Date(chatMessages[index - 1]?.createdAt).getTime()
              ) < 30000
            }
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-[#222733] p-[14px] flex flex-col gap-[14px]">
        <ChatMessageInput />
        <div className="flex gap-[4px] items-center">
          <button className={styles.chatButton}>
            <Image src="/images/Casino.png" width={20} height={20} alt="Casino" />
          </button>
          <button
            className={styles.chatButton}
            onClick={() => setTransferOpened(true)}
          >
            <IconTip />
            Send a tip
          </button>
          {/* <button className={styles.chatButton}>
            <IconRain />
            Rain
          </button> */}
          <button
            className={styles.chatButton}
            onClick={() => setRuleOpen(true)}
          >
            <IconRule />
            Chat rules
          </button>
        </div>
      </div>
      <ChatRuleDialog isOpen={ruleOpen} onClose={() => setRuleOpen(false)} />
      <TransferBalanceDialog
        isOpen={transferOpened}
        onClose={() => setTransferOpened(false)}
      />
    </section>
  ) : (
    !isMobile && (
      <button
        className={styles.expandButton}
        onClick={() => setChatExpanded(true)}
      >
        <IconChat />
        {chatMessages.length - chatLastReadIndexState > 0 && (
          <span className="w-[20px] h-[20px] bg-[#f00] rounded-full text-[#fff] text-[12px] flex justify-center items-center">
            {chatMessages.length - chatLastReadIndexState}
          </span>
        )}
      </button>
    )
  );
}
