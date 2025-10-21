import { instance } from "../instance";

export const apiGetReferredUsersCount = async () => {
  const res = await instance.get<number>(`/referral/referred-users-count`);
  return res.data;
};
