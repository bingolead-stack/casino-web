import { tGR8Game } from "./tGR8Game";
import { eTransactionType } from "./tTransaction";

export type tCustomGame = {
  id: number;
  gameId: number;
  category: string;
  order: number;

  GR8Game?: tGR8Game;
};
