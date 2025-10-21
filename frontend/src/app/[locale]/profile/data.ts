export const data: {
  [key: string]: {
    title: string;
    href: string;
    menu: {
      title: string;
      href: string;
    }[];
  };
} = {
  profile: {
    title: "Profile",
    href: "/profile",
    menu: [
      {
        title: "Account",
        href: "/profile/account",
      },
    ],
  },
  bonus: {
    title: "Bonus",
    href: "/bonus",
    menu: [
      {
        title: "Overview",
        href: "/bonus/overview",
      },
    ],
  },
  mybets: {
    title: "My bets",
    href: "/mybets",
    menu: [
      {
        title: "Casino",
        href: "/mybets/casino",
      },
      {
        title: "Sports",
        href: "/mybets/sportsbook",
      },
    ],
  },
  transactions: {
    title: "Transactions",
    href: "/transactions",
    menu: [
      {
        title: "Deposit",
        href: "/transactions/deposit",
      },
      {
        title: "Withdrawal",
        href: "/transactions/withdrawal",
      },
      {
        title: "Other",
        href: "/transactions/other",
      },
    ],
  },
  settings: {
    title: "Settings",
    href: "/settings",
    menu: [
      {
        title: "Security",
        href: "/settings/security",
      },
      {
        title: "Preferences",
        href: "/settings/preferences",
      },
      {
        title: "Verify",
        href: "/settings/verify",
      },
    ],
  },
  affiliates: {
    title: "Affiliate Program",
    href: "/affiliates",
    menu: [
      {
        title: "Overview",
        href: "/affiliates/overview",
      },
      {
        title: "Referrals",
        href: "/affiliates/referral",
      },
      {
        title: "Earnings",
        href: "/affiliates/earning",
      },
      {
        title: "Campaigns",
        href: "/affiliates/campaign",
      },
    ],
  },
};

export default data;
