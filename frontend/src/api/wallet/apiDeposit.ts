import { tUser } from "@/types/tUser";
import { instance } from "../instance";
import { tToken } from "@/types/tToken";

type tDepositRes = {
  accessToken: string;
  user: tUser;
};

export const apiDeposit = async (token: tToken) => {
  const res = await instance.post<tDepositRes>(`/deposit`, {
    token,
  });

  return res.data;
};
