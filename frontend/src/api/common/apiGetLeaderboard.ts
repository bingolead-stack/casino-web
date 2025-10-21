import { instance } from "../instance";
import { tPrize } from "@/types/tPrize";
import { tPrizeUser } from "@/types/tPrizeUser";

type tGetLeaderboardRes = {
  prize: tPrize;
  users: tPrizeUser[];
};

export const apiGetLeaderboard = async () => {
  const res = await instance.get<tGetLeaderboardRes>(`/prize/leaderboard`);
  return res.data;
};
