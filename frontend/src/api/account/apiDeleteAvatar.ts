import { instance } from "../instance";

export const apiDeleteAvatar = async () => {
  const res = await instance.post<boolean>(`/auth/delete-avatar`);

  return res.data;
};
