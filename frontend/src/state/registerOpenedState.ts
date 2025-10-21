import { atom } from "recoil";

export const registerOpenedState = atom<boolean>({
  key: "registerOpenedState",
  default: false,
});
