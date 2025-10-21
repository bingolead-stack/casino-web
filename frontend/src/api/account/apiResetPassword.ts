import { instance } from "../instance";

export const apiResetPassword = async (hash: string, password: string) => {
  const res = await instance.post<boolean>(`/auth/reset-password`, {
    hash,
    password,
  });

  return res.data;
};
