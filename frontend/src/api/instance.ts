import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/v1",
});

export const setAxiosAuthToken = (token: string | null | undefined) => {
  if (token) {
    instance.defaults.headers["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers["Authorization"];
  }
};
