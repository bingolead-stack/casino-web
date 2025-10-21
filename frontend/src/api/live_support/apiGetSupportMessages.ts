import { tLiveSupportMessage } from "@/types/tLiveSupportMessage";
import { instance } from "../instance";

export const apiGetSupportMessages = async (lastId: number, userId: string) => {
  const res = await instance.get<tLiveSupportMessage[]>(
    `/live-support/get-messages?lastId=${lastId}&userId=${userId}`
  );
  return res.data;
};