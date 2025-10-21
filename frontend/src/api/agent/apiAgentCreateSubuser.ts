import { instance } from "../instance";
import { tUser } from "@/types/tUser";

export const apiAgentCreateSubuser = async (
  userName: string,
  password: string
) => {
  const res = await instance.post<tUser>(`/agent/user`, {
    userName,
    password,
  });
  return res.data;
};
