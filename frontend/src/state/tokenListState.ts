import { tToken } from "@/types/tToken";
import { atom } from "recoil";

export const tokenListState = atom<tToken[]>({
  key: "tokenListState",
  default: [],
});
