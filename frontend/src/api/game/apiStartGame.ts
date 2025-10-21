import { instance } from "../instance";

export type tStartGameDto = {
  gameId: string;
  tokenName: string;
};

export const apiStartGame = async (data: tStartGameDto) => {
  const res = await instance.post<string>(`/gr8-casino/start-game`, data);
  return res.data;
};
