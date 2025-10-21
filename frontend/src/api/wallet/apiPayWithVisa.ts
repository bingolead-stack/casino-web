import { instance } from "../instance";

interface IApiPayWithVisaParams {
  fullName: string;
  amount: number;
  email: string;
  phone: string;
  country: string;
  redirectUrl: string
}

export async function apiPayWithVisa(params: IApiPayWithVisaParams) {
  const res = await instance.post("/xswiftly/process-payment", params);
  return res.data;
}