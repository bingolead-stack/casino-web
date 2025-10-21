"use client";

import React from "react";

import IconAffiliates from "@/assets/icons/sidebar/Affiliates.svg";
import IconBaccarat from "@/assets/icons/sidebar/Baccarat.svg";
import IconBlackjack from "@/assets/icons/sidebar/Blackjack.svg";
import IconBonusBuy from "@/assets/icons/sidebar/BonusBuy.svg";
import IconFavourites from "@/assets/icons/sidebar/Favourites.svg";
import IconGameShows from "@/assets/icons/sidebar/GameShows.svg";
import IconLiveCasino from "@/assets/icons/sidebar/LiveCasino.svg";
import IconMyBets from "@/assets/icons/sidebar/MyBets.svg";
import IconNewGames from "@/assets/icons/sidebar/NewGames.svg";
import IconPromotions from "@/assets/icons/sidebar/Promotions.svg";
import IconRecent from "@/assets/icons/sidebar/Recent.svg";
import IconRoulette from "@/assets/icons/sidebar/Roulette.svg";
import IconSlots from "@/assets/icons/sidebar/Slots.svg";
import IconTableGames from "@/assets/icons/sidebar/TableGames.svg";
import IconVIPClub from "@/assets/icons/sidebar/VIPClub.svg";

import styles from "./Sidebar.module.scss";
import SidebarAccordion from "../SidebarAccordion";
import { useRecoilState } from "recoil";
import { sidebarExpandedState } from "@/state/sidebarExpandedState";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { useTranslations } from "next-intl";

export default function Sidebar() {
  const [sidebarExpanded] = useRecoilState(sidebarExpandedState);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const t = useTranslations("Sidebar");

  return (
    <section
      className={styles.container}
      style={{
        width: isMobile ? "100vw" : sidebarExpanded ? "280px" : "80px",
        transform: isMobile
          ? sidebarExpanded
            ? "translate(0px, 0px)"
            : "translate(-100vw, 0)"
          : "",
      }}
    >
      <SidebarAccordion
        title={t("User_Center")}
        color="purple"
        options={[
          {
            icon: <IconRecent />,
            text: t("Recent"),
            href: "/recent",
          },
          {
            icon: <IconFavourites />,
            text: t("Favourites"),
            href: "/favorites",
          },
          {
            icon: <IconMyBets />,
            text: t("My_Bets"),
            href: "/profile/mybets/casino",
          },
        ]}
      />
      <SidebarAccordion
        title={t("Casino_Games")}
        color="yellow"
        options={[
          {
            icon: <IconSlots />,
            text: t("Slots"),
            href: "/slots/all",
          },
          {
            icon: <IconBonusBuy />,
            text: t("Bonus_Buy"),
            href: "/slots/bonus-buy",
          },
          {
            icon: <IconNewGames />,
            text: t("New_Games"),
            href: "/slots/new-games",
            badge: t("NEW"),
          },
          {
            icon: <IconLiveCasino />,
            text: t("Live_Casino"),
            href: "/slots/live-casino",
          },
          {
            icon: <IconTableGames />,
            text: t("Table_Games"),
            href: "/slots/table-games",
          },
          {
            icon: <IconGameShows />,
            text: t("Game_Shows"),
            href: "/slots/game-shows",
          },
          {
            icon: <IconRoulette />,
            text: t("Roulette"),
            href: "/slots/roulette",
          },
          {
            icon: <IconBlackjack />,
            text: t("Blackjack"),
            href: "/slots/blackjack",
          },
          {
            icon: <IconBaccarat />,
            text: t("Baccarat"),
            href: "/slots/baccarat",
          },
        ]}
      />
      <SidebarAccordion
        title={t("Casino_Features")}
        color="blue"
        options={[
          {
            icon: <IconPromotions />,
            text: t("Promotions"),
            href: "#",
            badge: t("SOON"),
          },
          {
            icon: <IconAffiliates />,
            text: t("Affiliates"),
            href: "/profile/affiliates/overview",
            badge: t("NEW"),
          },
          {
            icon: <IconVIPClub />,
            text: t("VIP_Club"),
            href: "/vip-club",
          },
        ]}
      />
    </section>
  );
}
