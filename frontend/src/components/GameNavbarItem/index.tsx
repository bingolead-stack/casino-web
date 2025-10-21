"use client";
import React from "react";
import styles from "./GameNavbarItem.module.scss";
import { Link } from "@/i18n/routing";

interface GameNavbarItemProps {
  icon: React.ReactNode;
  text: string;
  selected: boolean;
  id: string;
  basePath: string;
}

export default function GameNavbarItem({
  icon,
  text,
  id,
  selected,
  basePath,
}: GameNavbarItemProps) {
  return (
    <Link
      className={styles.navbarItem + (selected ? " " + styles.selected : "")}
      href={basePath + "?nav-category=" + id}
    >
      <div className={styles.icon}>{icon}</div>
      <div className={styles.text}>{text}</div>
    </Link>
  );
}
