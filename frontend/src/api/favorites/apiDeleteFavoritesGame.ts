import { instance } from "../instance";

export const apiDeleteFavoritesGame = async (gameId: string) => {
  const res = await instance.delete(`/favorite-game/${gameId}`);
  return res.data;
};
