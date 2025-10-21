import { instance } from "../instance";

export const apiAgentGetSubuserCount = async () => {
  const res = await instance.get<number>(`/agent/user/count`);
  return res.data;
};
