import { tUser } from "./tUser";

export type tPrizeUser = {
  prizeId: number;
  userId: string;
  wagered: number;
  prize: number;

  User?: tUser;
};
