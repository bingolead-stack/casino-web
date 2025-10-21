import { atom } from "recoil";

export const sidebarExpandedState = atom<boolean>({
  key: "sidebarExpandedState",
  default: window.innerWidth >= 1024,
});
