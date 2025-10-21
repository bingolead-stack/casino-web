"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Checkbox,
  Button,
} from "@nextui-org/react";
import { useRecoilState } from "recoil";
import IconInput from "./IconInput";
import axios from "axios";
import { toast } from "react-toastify";
import { accessTokenState } from "@/state/accessTokenState";
import { userState } from "@/state/userState";
import { setAxiosAuthToken } from "@/api/instance";
import IconUser from "@/assets/icons/login/user.svg";
import IconPassword from "@/assets/icons/login/password.svg";
import IconEmail from "@/assets/icons/login/email.svg";
import { loginOpenedState } from "@/state/loginOpenedState";
import { Link } from "@/i18n/routing";
import { apiRegister } from "@/api/account/apiRegister";
import { useSearchParams } from "next/navigation";
import { validateEmail } from "@/helpers/validateEmail";
import { passwordStrength } from "check-password-strength";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { sidebarExpandedState } from "@/state/sidebarExpandedState";
import { OAuthComponent } from "./OAuthComponent";

interface IRegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterDialog({
  isOpen,
  onClose,
}: IRegisterDialogProps) {
  const [loginOpened, setLoginOpened] = useRecoilState(loginOpenedState);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [_, setAccessToken] = useRecoilState(accessTokenState);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const [sidebarExpanded, setSidebarExpanded] =
    useRecoilState(sidebarExpandedState);
  const params = useSearchParams();
  const passwordStrengthValue = useMemo(
    () => passwordStrength(password).id,
    [password]
  );
  const enabledSubmit = useMemo(
    () =>
      !!(email && userName && password && password === password1 && agreeTerms),
    [email, userName, password, password1, agreeTerms]
  );

  useEffect(() => {
    setEmail("");
    setUserName("");
    setPassword("");
    setPassword1("");
    setAgreeTerms(false);
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

      if (!userName.trim()) {
        toast.error("Please input all fields");
        return;
      }

      const regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
      if (!regex.test(userName.trim())) {
        toast.error(
          "The first letter should start from lowercase or uppercase and the username can contain only letters, underscore and digits"
        );
        return;
      }

      if (!validateEmail(email)) {
        toast.error("Please input the correct email");
        return;
      }

      if (password !== password1) {
        toast.error("Password does not match");
        return;
      }

      setLoading(true);
      try {
        const res = await apiRegister(
          email,
          password,
          userName.trim(),
          params.get("ref")
        );
        await axios.post("/api/set-token", {
          access_token: res.accessToken,
        });
        setUser(res.user);
        setAccessToken(res.accessToken);
        setAxiosAuthToken(res.accessToken);
        toast.success("Successfully registered");
        onClose();
      } catch (ex) {
        if (axios.isAxiosError(ex)) {
          if (ex.response?.status === 400) {
            toast.error("Email or username is already taken");
          } else {
            toast.error("Something went wrong");
          }
        } else {
          toast.error("Something went wrong");
        }
        console.error(ex);
      }
      setLoading(false);
    },
    [agreeTerms, email, userName, password, password1]
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
              Create account
            </h2>
            <div className="text-[14px] leading-[20px] text-[#FFFFFF8E]">
              Already have an account?{" "}
              <span
                className="text-[var(--primary-color)] cursor-pointer"
                onClick={() => {
                  onClose();
                  setLoginOpened(true);
                }}
              >
                Sign In
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
                placeholder="Enter a unique username"
                value={userName}
                autoCapitalize="off"
                onChange={(e) => setUserName(e.target.value)}
                autoFocus={true}
              />
              <IconInput
                icon={
                  <div className="w-[24px] h-[24px] flex items-center justify-center">
                    <IconEmail />
                  </div>
                }
                placeholder="youremail@domain.com"
                value={email}
                autoCapitalize="off"
                onChange={(e) => setEmail(e.target.value)}
              />
              <IconInput
                icon={<IconPassword />}
                placeholder="Enter the strong password"
                type="password"
                value={password}
                autoCapitalize="off"
                onChange={(e) => setPassword(e.target.value)}
              />
              <IconInput
                icon={<IconPassword />}
                placeholder="Password confirmation"
                type="password"
                value={password1}
                autoCapitalize="off"
                onChange={(e) => setPassword1(e.target.value)}
              />
              <div className="flex gap-[11px] mb-2">
                {Array(4)
                  .fill(0)
                  .map((e, i) => (
                    <div
                      key={i}
                      className="flex-1 h-[6px] rounded-[4px]"
                      style={{
                        background:
                          i <= passwordStrengthValue ? "#FDCB35" : "#353840",
                      }}
                    />
                  ))}
              </div>
              <div className="flex w-full justify-between">
                <Checkbox color="success" onValueChange={setAgreeTerms}>
                  I accept and agree to all the{" "}
                  <Link href="#" className="text-[var(--primary-color)]">
                    Terms & Conditions
                  </Link>
                  , and I am over 18 years of age.
                </Checkbox>
              </div>
              <Button
                className="btn btn-primary h-[54px]"
                type="submit"
                isDisabled={!enabledSubmit}
                isLoading={loading}
              >
                Sign Up
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
