import { tUser } from "@/types/tUser";
import { instance } from "../instance";

type tLoginRes = {
  accessToken: string;
  user: tUser;
};

export const apiLogin = async (
  email: string,
  password: string,
  role: string
) => {
  const res = await instance.post<tLoginRes>(`/auth/login`, {
    email,
    password,
    role,
  });

  return res.data;
};
