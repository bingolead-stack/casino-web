import { tChatMessage } from "@/types/tChatMessage";
import { instance } from "../instance";

export const apiGetMessages = async (lastId: number) => {
  const res = await instance.get<tChatMessage[]>(
    `/chat/get-history?lastId=${lastId}`
  );
  return res.data;
};
