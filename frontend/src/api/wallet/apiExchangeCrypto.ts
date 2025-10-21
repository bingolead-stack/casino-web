import { instance } from "../instance";

interface IExDataType{
  sourceToken: string;
  destToken: string;
  balance: number;
}

export const apiExchangeCrypto = async (exData : IExDataType )=> {
  const res = await instance.post(`/wallet/convert-balance`, 
    exData,
  );

  return res.data;
};
