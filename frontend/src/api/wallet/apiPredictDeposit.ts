import { instance } from "../instance";

export const apiPredictDeposit = async (
  chainId: number,
  tokenAddress: string
) => {
  const res = await instance.post(`/predict-deposit`, {
    chainId,
    tokenAddress,
  });
  return res.data;
};
