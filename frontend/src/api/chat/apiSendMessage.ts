import { tChatMessage } from "@/types/tChatMessage";
import { instance } from "../instance";

export type SendMessageDto = {
  message: string;
  filepaths: string[];
  filenames: string[];
  replyId?: number;
  tempId: number;
};

export const apiSendMessage = async (data: SendMessageDto) => {
  const res = await instance.post<tChatMessage>(`/chat/send`, data);
  return res.data;
};
