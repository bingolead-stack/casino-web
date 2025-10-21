import { tGR8Game } from "@/types/tGR8Game";
import queryString from "query-string";
import { instance } from "../instance";
import { tPaginationResult } from "@/types/tPaginationResult";

export type tGameSearchParams = {
  keyword?: string;
  type?: string;
  offset?: number;
  limit?: number;
  provider?: string;
};

export const apiGetGames = async (params: tGameSearchParams) => {
  const res = await instance.get<tPaginationResult<tGR8Game>>(
    `/gr8-casino/games?${queryString.stringify(params)}`
  );
  return res.data;
};
