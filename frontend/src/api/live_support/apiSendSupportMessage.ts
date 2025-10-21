import { tLiveSupportMessage } from "@/types/tLiveSupportMessage";
import { instance } from "../instance";

export type SendMessageDto = {
  message: string;
  filepaths: string[];
  filenames: string[];
  replyId?: number;
  tempId: number;
};

export const apiSendSupportMessage = async (data: SendMessageDto) => {
  const res = await instance.post<tLiveSupportMessage>(
    "/live-support/send-user",
    data
  );
  return res.data;
};