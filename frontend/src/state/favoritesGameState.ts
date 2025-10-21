import { tGR8Game } from "@/types/tGR8Game";
import { atom } from "recoil";

export const favoritesGameState = atom<tGR8Game[]>({
  key: "favoritesGameState",
  default: [],
});
