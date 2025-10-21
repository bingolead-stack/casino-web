import { atom } from "recoil";

export const forgotOpenedState = atom<boolean>({
  key: "forgotOpenedState",
  default: false,
});
