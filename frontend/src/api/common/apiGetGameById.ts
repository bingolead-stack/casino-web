import { tGR8Game } from "@/types/tGR8Game";
import { instance } from "../instance";

export const apiGetGameById = async (id: string) => {
  const res = await instance.get<tGR8Game>(`/gr8-casino/${id}`);
  return res.data;
};
