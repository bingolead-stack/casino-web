"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Checkbox,
  Button,
} from "@nextui-org/react";
import { useRecoilState } from "recoil";
import { registerOpenedState } from "@/state/registerOpenedState";
import IconInput from "./IconInput";
import axios from "axios";
import { toast } from "react-toastify";
import { accessTokenState } from "@/state/accessTokenState";
import { userState } from "@/state/userState";
import { apiLogin } from "@/api/account/apiLogin";
import { setAxiosAuthToken } from "@/api/instance";
import IconUser from "@/assets/icons/login/user.svg";
import IconPassword from "@/assets/icons/login/password.svg";
import { forgotOpenedState } from "@/state/forgotOpenedState";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { sidebarExpandedState } from "@/state/sidebarExpandedState";
import { OAuthComponent } from "./OAuthComponent";

interface ILoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginDialog({ isOpen, onClose }: ILoginDialogProps) {
  const [registerOpened, setRegisterOpened] =
    useRecoilState(registerOpenedState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [_, setAccessToken] = useRecoilState(accessTokenState);
  const [forgotOpened, setForgotOpened] = useRecoilState(forgotOpenedState);
  const [sidebarExpanded, setSidebarExpanded] =
    useRecoilState(sidebarExpandedState);
  const isMobile = useMediaQuery(mobileMediaQuery);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setRemember(false);
  }, [isOpen]);

  useEffect(() => {
    if (isMobile) {
      setSidebarExpanded(false);
    }
  }, [isOpen, isMobile]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (loading) {
        return;
      }

      if (!email || !password) {
        toast.error("Please input all fields");
        return;
      }

      setLoading(true);
      try {
        const res = await apiLogin(email, password, "NORMAL");
        await axios.post("/api/set-token", {
          access_token: res.accessToken,
        });
        setUser(res.user);
        setAccessToken(res.accessToken);
        setAxiosAuthToken(res.accessToken);
        toast.success("Successfully logged in");
        onClose();
        setLoading(false);
      } catch (ex) {
        if (axios.isAxiosError(ex)) {
          if (ex.response?.status === 401) {
            toast.error("Email or password is incorrect");
          } else {
            toast.error("Something went wrong");
          }
        } else {
          toast.error("Something went wrong");
        }
        console.error(ex);
        setLoading(false);
      }
    },
    [remember, email, password]
  );

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      scrollBehavior="inside"
      size={isMobile ? "full" : "lg"}
    >
      <ModalContent className="w-[540px] md:max-w-[540px]">
        <ModalBody className="p-0 flex flex-col items-center gap-0">
          <div className="flex flex-col items-center justify-center p-[36px] gap-[9px]">
            <div className="w-[63px] h-[63px] flex flex-col items-center justify-center rounded-[16px] bg-[#222733] p-[12px]">
              <img
                src="/favicon/icon-512x512.png"
                className="w-full h-full"
                alt="Casino"
              />
            </div>
            <h2 className="font-bold text-[20px] leading-[27px] text-[#fff]">
              Sign In
            </h2>
            <div className="text-[14px] leading-[20px] text-[#FFFFFF8E]">
              Need an account?{" "}
              <span
                className="text-[var(--primary-color)] cursor-pointer"
                onClick={() => {
                  onClose();
                  setRegisterOpened(true);
                }}
              >
                Create Account
              </span>
            </div>
          </div>
          <div className="flex flex-col p-[27px] border-t-1 border-[#FFFFFF0A] w-full">
            <form
              className="flex flex-col w-full gap-[18px]"
              onSubmit={onSubmit}
            >
              <IconInput
                icon={
                  <div className="w-[24px] h-[24px] flex items-center justify-center">
                    <IconUser />
                  </div>
                }
                placeholder={"Email Or Username*"}
                value={email}
                autoCapitalize="off"
                onChange={(e) => setEmail(e.target.value)}
                autoFocus={true}
              />
              <IconInput
                icon={<IconPassword />}
                placeholder="Password*"
                type="password"
                value={password}
                autoCapitalize="off"
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex w-full justify-between">
                <Checkbox color="success" onValueChange={setRemember}>
                  Remember me
                </Checkbox>
                <span
                  className="text-[var(--primary-color)] cursor-pointer"
                  onClick={() => {
                    onClose();
                    setForgotOpened(true);
                  }}
                >
                  Forgot password?
                </span>
              </div>
              <Button
                className="btn btn-primary h-[54px]"
                type="submit"
                isLoading={loading}
              >
                Sign In
              </Button>
            </form>
            <div className="flex py-[27px] gap-[8px] items-center">
              <div className="flex-1 h-[1px] bg-[#FFFFFF11]" />
              <div className="text-[12px] leading-[16px] text-[#FFFFFF51]">
                Or continue with (Coming soon)
              </div>
              <div className="flex-1 h-[1px] bg-[#FFFFFF11]" />
            </div>
            <OAuthComponent />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
