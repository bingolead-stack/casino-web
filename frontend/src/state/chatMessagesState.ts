import { tChatMessage } from "@/types/tChatMessage";
import { atom } from "recoil";

export const chatMessagesState = atom<tChatMessage[]>({
  key: "chatMessagesState",
  default: [],
});
