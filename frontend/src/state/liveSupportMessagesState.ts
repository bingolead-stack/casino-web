import { tLiveSupportMessage } from "@/types/tLiveSupportMessage";
import { atom } from "recoil";

export const liveSupportMessagesState = atom<tLiveSupportMessage[]>({
  key: "liveSupportMessagesState",
  default: [],
});