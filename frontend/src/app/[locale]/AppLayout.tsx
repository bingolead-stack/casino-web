import React from "react";
import { MyProvider } from "@/provider/MyProvider";
import { cookies } from "next/headers";
import axios from "axios";
import { apiAccount } from "@/api/account/apiAccount";
import { setAxiosAuthToken } from "@/api/instance";
import dynamic from "next/dynamic";

const ClientProvider = dynamic(
  () => import("@/provider/ClientProvider"),
  { ssr: false }
);

interface ApplicationLayoutProps {
  children: React.ReactNode;
}

export const ApplicationLayout: React.FC<ApplicationLayoutProps> = async ({ children }) => {
  // check current login state
  let access_token: string | null =
    cookies().get("access_token")?.value ?? null;
  let initialUser = null;

  if (access_token) {
    try {
      setAxiosAuthToken(access_token);
      initialUser = await apiAccount();
    } catch (ex) {
      access_token = null;
      setAxiosAuthToken("");
      if (axios.isAxiosError(ex)) {
        console.error(ex.message);
      } else {
        console.error(ex);
      }
    }
  }

  return (
    <MyProvider>
      <ClientProvider
        initialUser={initialUser}
        initialToken={access_token}
      >
        {children}
      </ClientProvider>
    </MyProvider>
  );
};
