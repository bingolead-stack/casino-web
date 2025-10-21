import { tGR8Provider } from "@/types/tGR8Provider";
import { atom } from "recoil";

type tProviderState = {
  array: tGR8Provider[];
  map: { [id: string]: tGR8Provider };
};

export const providerState = atom<tProviderState>({
  key: "providerState",
  default: {
    array: [],
    map: {},
  },
});
