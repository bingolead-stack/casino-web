import { atom } from "recoil";

export const liveSupportExpandedState = atom<boolean>({
  key: "liveSupportExpandedState",
  default: false,
});