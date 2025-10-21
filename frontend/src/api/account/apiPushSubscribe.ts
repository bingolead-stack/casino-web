import { instance } from "../instance";

export const apiPushSubscribe = async (subscription: PushSubscription) => {
  const res = await instance.post(`/push/subscribe`, subscription);
  return res.data;
};
