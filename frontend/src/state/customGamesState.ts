import { tCustomGame } from "@/types/tCustomGame";
import { atom } from "recoil";

export const customGamesState = atom<tCustomGame[]>({
  key: "customGamesState",
  default: [],
});
