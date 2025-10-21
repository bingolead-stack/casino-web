import React from "react";
import IconProfile from "@/assets/icons/profile/profile.svg";
import IconMyBets from "@/assets/icons/profile/mybets.svg";
import IconDeposit from "@/assets/icons/profile/deposit.svg";
import IconWithdraw from "@/assets/icons/profile/withdraw.svg";
import IconAffiliates from "@/assets/icons/profile/affiliates.svg";
import IconBonus from "@/assets/icons/profile/bonus.svg";
import IconVIP from "@/assets/icons/profile/vip.svg";
import IconTransactions from "@/assets/icons/profile/transactions.svg";
import IconSettings from "@/assets/icons/profile/settings.svg";
import IconLogout from "@/assets/icons/profile/logout.svg";

export const data: {
  icon: React.ReactNode;
  title: string;
  href?: string;
  key?: string;
}[] = [
  {
    icon: <IconProfile />,
    title: "Profile",
    href: "/profile/profile/account",
  },
  {
    icon: <IconMyBets />,
    title: "My Bets",
    href: "/profile/mybets/casino",
  },
  {
    icon: <IconDeposit />,
    title: "Deposit",
    href: "/wallet/deposit",
  },
  {
    icon: <IconWithdraw />,
    title: "Withdraw",
    href: "/wallet/withdraw",
  },
  {
    icon: <IconAffiliates />,
    title: "Affiliates",
    href: "/profile/affiliates/overview",
  },
  {
    icon: <IconBonus />,
    title: "Bonus",
    key: "bonus",
  },
  {
    icon: <IconVIP />,
    title: "VIP",
    href: "/vip-club",
  },
  {
    icon: <IconTransactions />,
    title: "Transactions",
    href: "/profile/transactions/deposit",
  },
  {
    icon: <IconSettings />,
    title: "Settings",
    href: "/profile/settings/security",
  },
  {
    icon: <IconLogout />,
    title: "Log Out",
    key: "logout",
  },
];
