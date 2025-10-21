import { atom } from "recoil";

export const favoritesGameFlagState = atom<{ [gameId: string]: boolean }>({
  key: "favoritesGameFlagState",
  default: {},
});
