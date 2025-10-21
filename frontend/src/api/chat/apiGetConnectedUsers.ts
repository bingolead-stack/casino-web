import { instance } from "../instance";

export const apiGetConnectedUsers = async () => {
  const res = await instance.get<string[]>(`/chat/get-connected-users`);
  return res.data;
};
