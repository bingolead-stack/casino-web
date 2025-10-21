import { tPaginationResult } from "@/types/tPaginationResult";
import { instance } from "../instance";
import { tUser } from "@/types/tUser";
import queryString from "query-string";

export type tParam = {
  offset?: number;
  length?: number;
};

export type tReferredUsers = {
  id: string;
  email: string;
  userName: string;
  cash: number;
  createdAt: Date;
  profit: number;
};

export const apiGetReferredUsers = async (param: tParam) => {
  const res = await instance.get<tPaginationResult<tReferredUsers>>(
    `/referral/referred-users?${queryString.stringify(param)}`
  );
  return res.data;
};
