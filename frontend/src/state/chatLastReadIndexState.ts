import { atom } from "recoil";

export const chatLastReadIndexState = atom<number>({
  key: "chatLastReadIndexState",
  default: 0,
});
