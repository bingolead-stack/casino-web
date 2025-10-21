"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react";
import IconInput from "./IconInput";
import axios from "axios";
import { toast } from "react-toastify";
import IconUser from "@/assets/icons/login/user.svg";
import { validateEmail } from "@/helpers/validateEmail";
import { apiForgotPassword } from "@/api/account/apiForgotPassword";

interface IForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordDialog({
  isOpen,
  onClose,
}: IForgotPasswordDialogProps) {
  const [email, setEmail] = useState("");
  const enabledSubmit = useMemo(() => !!email && validateEmail(email), [email]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setEmail("");
    setMsg("");
    setError("");
  }, [isOpen]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (loading) {
        return;
      }

      if (!email || !validateEmail(email)) {
        toast.error("Please input the correct email");
        return;
      }

      setLoading(true);
      try {
        setLoading(true);
        await apiForgotPassword(email);
        setError("");
        setMsg("Password reset link was sent to " + email);
      } catch (ex) {
        setError(
          "Something went wrong. Please check your email exists"
        );
        setMsg("");
      }
      setLoading(false);
    },
    [email]
  );

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent className="w-[540px]">
        <ModalBody className="p-0 flex flex-col items-center gap-0">
          <div className="flex flex-col items-center justify-center p-[36px] gap-[27px]">
            <div className="w-[63px] h-[63px] flex flex-col items-center justify-center rounded-[16px] bg-[#222733] p-[12px]">
              <img
                src="/favicon/icon-512x512.png"
                className="w-full h-full"
                alt="Casino"
              />
            </div>
            <h2 className="font-bold text-[20px] leading-[27px] text-[#fff]">
              Forgot Password?
            </h2>
          </div>
          <div className="flex flex-col p-[27px] border-t-1 border-[#FFFFFF0A] w-full">
            <form
              className="flex flex-col w-full gap-[18px]"
              onSubmit={onSubmit}
            >
              <div>
                No worries, just enter the email registered account and we will
                send you a password reset link.
              </div>
              <IconInput
                icon={
                  <div className="w-[24px] h-[24px] flex items-center justify-center">
                    <IconUser />
                  </div>
                }
                placeholder="youremail@domain.com"
                value={email}
                autoCapitalize="off"
                onChange={(e) => setEmail(e.target.value)}
              />

              {error && (
                <div className="text-[#f44] text-[12px] text-center">
                  {error}
                </div>
              )}
              {msg && (
                <div className="text-[#4f4] text-[12px] text-center">{msg}</div>
              )}
              <Button
                className="btn btn-primary h-[54px]"
                type="submit"
                disabled={!enabledSubmit}
                isLoading={loading}
              >
                Send password reset link
              </Button>
            </form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
