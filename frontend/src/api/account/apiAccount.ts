import { tUser } from "@/types/tUser";
import { instance } from "../instance";

export const apiAccount = async () => {
  const res = await instance.get<tUser>(`/auth/account`);
  return res.data;
};
