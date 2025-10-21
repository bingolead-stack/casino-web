"use client"

import { Link, usePathname } from "@/i18n/routing";
import React from "react";

const navbarItems = [
  {
    path: "/wallet/deposit",
    text: "Deposit",
  },
  {
    path: "/wallet/withdraw",
    text: "Withdraw",
  },
];

export default function DepositNav() {
  const pathname = usePathname();

  return (
    <ul className="deposit-withdraw-nav">
      {navbarItems.map((e) => (
        <li
          key={e.text}
          className={
            "navbar-item-wrapper " + (pathname === e.path ? "active" : "")
          }
        >
          <Link className="navbar-item" href={e.path}>
            {e.text}
          </Link>
          <div className="bottom-border" />
        </li>
      ))}
    </ul>
  );
}
