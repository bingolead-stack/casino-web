import { instance } from "../instance";

export type tStartGameDto = {
  gameId: number;
  lang: string;
  exiturl: string;
  mobile: boolean;
  tokenName: string;
};

export const apiStartGameDemo = async (data: tStartGameDto) => {
  const res = await instance.post<string>(`/fungamess/start-game-demo`, data);
  return res.data;
};
