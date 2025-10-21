import { instance } from "../instance";

export const apiAddFavoritesGame = async (gameId: string) => {
  const res = await instance.post(`/favorite-game`, {
    gameId,
  });
  return res.data;
};
