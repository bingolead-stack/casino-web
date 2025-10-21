"use client";

import React from "react";
import { useRecoilState } from "recoil";
import { userState } from "@/state/userState";
import { Link } from "@/i18n/routing";
import Slot from "./slots/Home";

export default function Home() {
  const [user] = useRecoilState(userState);
  return user?.isAgent ? (
    <div className="w-full h-full flex items-center justify-center pt-[100px]">
      <Link className="hover:underline" href="/agent">
        Please go to the agent page
      </Link>
    </div>
  ) : (
    <Slot />
  );
}
