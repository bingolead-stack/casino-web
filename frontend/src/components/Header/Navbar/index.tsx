"use client";

import React, { useMemo } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { agentNavbarItems, navbarItems } from "../data";
import styles from "./Navbar.module.scss";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { useRecoilState } from "recoil";
import { userState } from "@/state/userState";
import { chatExpandedState } from "@/state/chatExpandedState";

export default function Navbar() {
  const pathname = usePathname();
  const [user] = useRecoilState(userState);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const homePath = useMemo(
    () => (user?.isAgent ? "/agent" : "/"),
    [user?.isAgent]
  );
  const searchParams = useSearchParams();
  const [chatExpanded, setChatExpanded] = useRecoilState(chatExpandedState);

  const onClickItem = (key: string) => {
    if (key === "chat") {
      setChatExpanded(true);
    }
  };

  return (
    <ul className={styles.navbar}>
      {navbarItems.map((e) => (
        <li
          key={e.text}
          className={
            styles["navbar-item-wrapper"] +
            " " +
            ((pathname === e.path && pathname === homePath) ||
            (e.path !== homePath && pathname.startsWith(e.path)) ||
            (e.path === "/" && pathname.startsWith("/slots"))
              ? styles.active
              : "")
          }
        >
          {e.key ? (
            <div
              className={styles["navbar-item"]}
              onClick={() => onClickItem(e.key || "")}
            >
              <div className={styles["navbar-item-icon"]}>{e.icon}</div>
              <div className={styles["navbar-item-text"]}>
                {isMobile ? e.mobileText : e.text}
              </div>
            </div>
          ) : (
            <Link
              className={styles["navbar-item"]}
              href={
                e.path +
                (searchParams.get("ref")
                  ? "?ref=" + searchParams.get("ref")
                  : "")
              }
              onClick={() => setChatExpanded(false)}
            >
              <div className={styles["navbar-item-icon"]}>{e.icon}</div>
              <div className={styles["navbar-item-text"]}>
                {isMobile ? e.mobileText : e.text}
              </div>
            </Link>
          )}
          <div className={styles["bottom-border"]} />
        </li>
      ))}
    </ul>
  );
}
