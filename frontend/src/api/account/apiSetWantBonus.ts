import { instance } from "../instance";

export const apiSetWantBonus = async (wantBonus: boolean) => {
  const res = await instance.post<boolean>(`/auth/want-bonus`, {
    wantBonus,
  });

  return res.data;
};
