import { atom } from "recoil";

export const accessTokenState = atom<string | null | undefined>({
  key: "accessTokenState",
  default: "",
});
