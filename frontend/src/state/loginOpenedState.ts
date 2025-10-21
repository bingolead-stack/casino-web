import { atom } from "recoil";

export const loginOpenedState = atom<boolean>({
  key: "loginOpenedState",
  default: false,
});
