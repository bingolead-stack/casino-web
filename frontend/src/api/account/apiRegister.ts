import { tUser } from "@/types/tUser";
import { instance } from "../instance";
import { encrypt } from "@/helpers/encrypt";

type tRegisterRes = {
  accessToken: string;
  user: tUser;
};

export const apiRegister = async (
  email: string,
  password: string,
  userName: string,
  referCode: any
) => {
  const token = encrypt(
    email + email.length + password + password.length + userName + "vva"
  );
  const res = await instance.post<tRegisterRes>(`/auth/signup`, {
    email,
    password,
    userName,
    referCode: referCode ?? null,
    token,
  });

  return res.data;
};
