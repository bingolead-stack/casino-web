import { instance } from "../instance";

export const apiGetSetting = async (id: string) => {
  const res = await instance.get<string>(`/setting/get/${id}`);
  return res.data;
};
