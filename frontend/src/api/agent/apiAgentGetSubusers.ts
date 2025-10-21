import { instance } from "../instance";
import { tPaginationResult } from "@/types/tPaginationResult";
import { tUser } from "@/types/tUser";

export const apiAgentGetSubusers = async (offset: number, length: number) => {
  const res = await instance.get<tPaginationResult<tUser>>(
    `/agent/user?offset=${offset}&length=${length}`
  );
  return res.data;
};
