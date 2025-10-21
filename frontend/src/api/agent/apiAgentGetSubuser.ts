import { tUser } from "@/types/tUser";
import { instance } from "../instance";

export const apiAgentGetSubuser = async (id: string) => {
  const res = await instance.get<tUser>(`/agent/user/${id}`);
  return res.data;
};
