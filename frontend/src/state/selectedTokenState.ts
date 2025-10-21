import { supportingChainIds } from "@/config/constants";
import { atom } from "recoil";

export const selectedTokenState = atom<string>({
  key: "selectedTokenState",
  default: window.localStorage.getItem("tokenName") || "0",
});
