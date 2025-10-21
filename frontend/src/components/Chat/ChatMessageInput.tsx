"use client";

import { chatMessagesState } from "@/state/chatMessagesState";
import { userState } from "@/state/userState";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { MdSend } from "react-icons/md";
import { Button } from "@nextui-org/react";
import { apiSendMessage } from "@/api/chat/apiSendMessage";

const ChatMessageInput: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useRecoilState(chatMessagesState);
  const [user] = useRecoilState(userState);
  // const [image, setImage] = useState<string | null>(null);

  // const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
  //   const clipboardItems = event.clipboardData.items;
  //   for (let i = 0; i < clipboardItems.length; i++) {
  //     const item = clipboardItems[i];
  //     if (item.type.indexOf("image") !== -1) {
  //       const blob = item.getAsFile();
  //       if (blob) {
  //         const url = URL.createObjectURL(blob);
  //         setImage(url);
  //       }
  //       break;
  //     }
  //   }
  // };

  useEffect(() => {
    if (divRef.current) {
      divRef.current.focus();
    }
  }, [divRef?.current]);

  const sendMessage = useCallback(async () => {
    if (!divRef.current || !user?.id) {
      return;
    }

    const tempId = -new Date().getTime();
    const message = divRef.current.innerHTML
      .replaceAll("<div>", "")
      .replaceAll("</div>", "")
      .replaceAll("<html>", "")
      .replaceAll("</html>", "")
      .replaceAll("<body>", "")
      .replaceAll("</body>", "")
      .replaceAll("<p>", "")
      .replaceAll("</p>", "")
      .replaceAll("<br>", "\n")
      .trim();

    if (!message) {
      return;
    }

    setChatMessages((p) => [
      ...p,
      {
        id: tempId,
        senderId: user.id,
        message,
        filepaths: [],
        filenames: [],
        replyId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isEdited: false,
        isDeleted: false,
        mentionedUserIds: [],

        User: user,
        status: 1,
      },
    ]);
    divRef.current.innerHTML = "";

    try {
      const res = await apiSendMessage({
        message,
        filepaths: [],
        filenames: [],
        tempId: tempId,
      });
    } catch (ex) {
      console.error(ex);
      setChatMessages((p) => {
        const i = p.findIndex((e) => e.id === tempId);
        if (i === -1) {
          return p;
        }

        const p1 = [...p];
        p1[i] = { ...p1[i], status: 2 };
        return p1;
      });
    }
  }, [divRef.current, user?.id]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      sendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-[9px] w-full">
        <div
          onKeyDown={handleKeyDown}
          className="w-[calc(100%-54px)] bg-[#161820] rounded-[9px] text-[#FFFFFFA0] text-[16px] leading-[27px] px-[15px] py-[9px] outline-[0px] min-h-[45px] max-h-[200px] overflow-auto"
          contentEditable={!!user?.id}
          ref={divRef}
          autoFocus={true}
          // onPaste={handlePaste}
        />
        <Button
          className="w-[45px] h-[45px] flex items-center justify-center p-[0] min-w-[unset]"
          color="primary"
          type="button"
          onClick={sendMessage}
          isDisabled={!user?.id}
        >
          <MdSend size={22} />
        </Button>
      </div>
    </div>
  );
};

export default ChatMessageInput;
