import { atom } from "recoil";

export const chatExpandedState = atom<boolean>({
  key: "chatExpandedState",
  default: false,
});
