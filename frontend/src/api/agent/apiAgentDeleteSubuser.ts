import { instance } from "../instance";

export const apiAgentDeleteSubuser = async (id: string) => {
  const res = await instance.delete(`/agent/user/${id}`);
  return res.data;
};
