import { instance } from "../instance";

export const apiForgotPassword = async (email: string) => {
  const res = await instance.post<boolean>(`/auth/forgot-password`, {
    email,
  });

  return res.data;
};
