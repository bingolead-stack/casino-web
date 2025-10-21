"use client";

import React from "react";
import styles from "./Layout.module.scss";
import HeaderBox from "./HeaderBox";
import { data } from "./data";
import { Link, usePathname } from "@/i18n/routing";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  return (
    <div className={styles.container}>
      <HeaderBox />
      <div className={styles.vertical_tabs}>
        <div className={styles.tabs}>
          {data.map((tab) => (
            <Link
              key={tab.key}
              href={tab.key}
              className={
                styles.tab + ` ${pathname === tab.key ? styles.active : ""}`
              }
            >
              {tab.title}
            </Link>
          ))}
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
