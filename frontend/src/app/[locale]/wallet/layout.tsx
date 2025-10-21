import React from "react";
import DepositNav from "./DepositNav";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="deposit-withdraw-page">
      <DepositNav />
      {children}
    </div>
  );
}
