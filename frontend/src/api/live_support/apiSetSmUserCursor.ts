import { instance } from "../instance";

interface ISetSmUserCursorProps{
  userId: string;
  cursor: number;
}

export const apiSetSmUserCursor = async ({userId, cursor}: ISetSmUserCursorProps) => {
  const res = await instance.post<boolean>("/live-support/set-user-cursor", {userId, cursor});
  return res.data;
}