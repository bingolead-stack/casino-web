"use client";

import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { validateEmail } from "@/helpers/validateEmail";
import { toast } from "react-toastify";
import { apiForgotPassword } from "@/api/account/apiForgotPassword";

export default function ForgotPassword() {
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget)) as {
      email: string;
    };
    if (!data.email || !validateEmail(data.email)) {
      setError("Please input correct email address");
      setMsg("");
      return;
    }

    try {
      setLoading(true);
      await apiForgotPassword(data.email);
      setError("");
      setMsg("Password reset link was sent to " + data.email);
    } catch (ex) {
      setError(
        "Something went wrong. Please check your email exists."
      );
      setMsg("");
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-full flex items-center justify-center absolute">
      <form className="w-full max-w-xs flex flex-col gap-2" onSubmit={onSubmit}>
        <h1 className="text-center text-[24px] uppercase font-bold mb-2">
          Forgot password
        </h1>
        <Input
          autoFocus
          autoCapitalize="off"
          isRequired
          label="Email"
          name="email"
          placeholder="Enter your email"
          type="text"
          variant="bordered"
        />
        {error && (
          <div className="text-[#f44] text-[12px] text-center">{error}</div>
        )}
        {msg && (
          <div className="text-[#4f4] text-[12px] text-center">{msg}</div>
        )}
        <Button color="success" type="submit" isLoading={loading}>
          Send Password Reset Link
        </Button>
      </form>
    </div>
  );
}
