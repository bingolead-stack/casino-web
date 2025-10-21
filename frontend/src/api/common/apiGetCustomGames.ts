import { tGR8Game } from "@/types/tGR8Game";
import queryString from "query-string";
import { instance } from "../instance";
import { tPaginationResult } from "@/types/tPaginationResult";
import { tCustomGame } from "@/types/tCustomGame";

export type tGameSearchParams = {
  category?: string;
  offset?: number;
  limit?: number;
};

export const apiGetCustomGames = async (params: tGameSearchParams) => {
  const res = await instance.get<tPaginationResult<tCustomGame>>(
    `/gr8-casino/custom-games?${queryString.stringify(params)}`
  );
  return res.data;
};
