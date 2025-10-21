"use client";

import { tChatMessage } from "@/types/tChatMessage";
import React from "react";
import moment from "moment";
import VIPLevelChip from "../VIPLevelChip";
import ClipLoader from "react-spinners/ClipLoader";

interface IChatMessage {
  data: tChatMessage;
  sameUser: boolean;
}

const ChatMessage: React.FC<IChatMessage> = ({ data, sameUser }) => {
  return (
    <div className="flex gap-[9px] w-full">
      <div
        className="w-[36px] h-[36px] rounded-full overflow-hidden"
        style={{ visibility: sameUser ? "hidden" : "visible" }}
      >
        <img
          className="rounded-full"
          width={36}
          height={36}
          alt={data.User?.userName || ""}
          src={data.User?.avatar || "/images/default-avatar.png"}
        />
      </div>
      <div className="flex flex-col gap-[10px] flex-1">
        {!sameUser && (
          <div className="flex gap-[5px] items-center">
            <span className="text-[12px] leading-[16px] text-[#FFFFFF8E]">
              {data.User?.userName || "Unnamed"}
            </span>
            <VIPLevelChip level={data.User?.vipLevel || 0} />
            <span className="text-[12px] leading-[16px] text-[#FFFFFF51]">
              {moment(data.createdAt).format("YYYY-MM-DD hh:mm A")}
            </span>
            {data.status === 1 && (
              <ClipLoader size={16} color="#FFFFFF51" speedMultiplier={0.7} />
            )}
          </div>
        )}
        <div className="flex">
          <div
            className="px-[9px] py-[7px] whitespace-pre-line break-all bg-[#272D3C] text-[16px leading-[22px] rounded-[9px] rounded-tl-[0px]"
            style={{
              color:
                data.status === 1
                  ? "#C2C4C890"
                  : data.status === 2
                  ? "#ff3333"
                  : "#C2C4C8",
            }}
            dangerouslySetInnerHTML={{ __html: data.message }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
