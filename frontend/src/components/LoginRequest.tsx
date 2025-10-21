"use client";

import { Button } from "@nextui-org/react";
import { loginOpenedState } from "@/state/loginOpenedState";
import { useRecoilState } from "recoil";

export default function LoginRequest() {
  const [loginOpened, setLoginOpened] = useRecoilState(loginOpenedState);

  return (
    <div className="p-4 mt-4 flex justify-center">
      <Button className="btn btn-primary" onClick={() => setLoginOpened(true)}>
        Please login first
      </Button>
    </div>
  );
}
