"use client";

import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { validateEmail } from "@/helpers/validateEmail";
import { toast } from "react-toastify";
import { apiForgotPassword } from "@/api/account/apiForgotPassword";
import { useSearchParams } from "next/navigation";
import { apiResetPassword } from "@/api/account/apiResetPassword";
import axios from "axios";

export default function ResetPassword() {
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget)) as {
      new1: string;
      new2: string;
    };
    if (!data.new1 || data.new1 !== data.new2) {
      setError("Password does not match");
      setMsg("");
      return;
    }

    try {
      setLoading(true);
      await apiResetPassword(searchParams.get("token") as string, data.new1);
      setError("");
      setMsg("Password was reset successfully");
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        if (ex.response?.data.message === "token.not-found") {
          setError("Password reset token was not found");
        } else if (ex.response?.data.message === "token.expired") {
          setError("Password reset token was expired");
        } else {
          setError(
            "Something went wrong. Please check your email exists"
          );
        }
      } else {
        setError(
          "Something went wrong. Please check your email exists"
        );
      }
      setMsg("");
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-[calc(100vh-300px)] flex items-center justify-center p">
      <form className="w-full max-w-xs flex flex-col gap-4" onSubmit={onSubmit}>
        <h1 className="text-center text-[24px] uppercase font-bold mb-2">
          Reset password
        </h1>
        <Input
          autoFocus
          autoCapitalize="off"
          isRequired
          label="Password"
          name="new1"
          placeholder="Enter your password"
          type="password"
          variant="bordered"
        />
        <Input
          autoCapitalize="off"
          isRequired
          label="Confirmation"
          name="new2"
          placeholder="Enter your password"
          type="password"
          variant="bordered"
        />
        {error && (
          <div className="text-[#f44] text-[12px] text-center">{error}</div>
        )}
        {msg && (
          <div className="text-[#4f4] text-[12px] text-center">{msg}</div>
        )}
        <Button color="success" type="submit" isLoading={loading}>
          Reset password
        </Button>
      </form>
    </div>
  );
}
