import { atom } from "recoil";

export const supportMessagesUnseenState = atom<number>({
  key: "supportMessagesUnseenState",
  default: 0,
});