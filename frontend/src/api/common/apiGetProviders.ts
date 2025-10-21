import { instance } from "../instance";
import { tGR8Provider } from "@/types/tGR8Provider";

export const apiGetProviders = async () => {
  const res = await instance.get<tGR8Provider[]>(`/gr8-casino/providers`);
  return res.data;
};
