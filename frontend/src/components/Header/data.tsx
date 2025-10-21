import IconSports from "./sports.svg";
import IconSlots from "./slots.svg";
import IconLive from "./live.svg";
import IconMybets from "./mybets.svg";
import { FaChartBar, FaRocketchat, FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import React from "react";

export const navbarItems: {
  icon: React.ReactNode;
  text: string;
  mobileText: string;
  path: string;
  key?: string;
}[] = [
  {
    icon: <IconSlots />,
    text: "Casino",
    mobileText: "Casino",
    path: "/",
  },
  {
    icon: <IconSports />,
    text: "Sports",
    mobileText: "Sports",
    path: "/sports/en",
  },
  {
    icon: <IconMybets />,
    text: "My bets",
    mobileText: "My bets",
    path: "/profile/mybets/casino",
  },
  {
    icon: (
      <div className="w-[24px] h-[24px] flex justify-center items-center">
        <FaHeart size={18} />
      </div>
    ),
    text: "Favorites",
    mobileText: "Favorites",
    path: "/favorites",
  },
  // {
  //   icon: (
  //     <div className="w-[24px] h-[24px] flex justify-center items-center">
  //       <FaRocketchat size={18} />
  //     </div>
  //   ),
  //   text: "Chat",
  //   mobileText: "Chat",
  //   path: "#",
  //   key: "chat",
  // },
];

export const agentNavbarItems = [
  {
    icon: <FaChartBar />,
    text: "Dashboard",
    mobileText: "Dashboard",
    path: "/agent",
  },
  {
    icon: <FaUser />,
    text: "Users",
    mobileText: "Users",
    path: "/agent/users",
  },
];
