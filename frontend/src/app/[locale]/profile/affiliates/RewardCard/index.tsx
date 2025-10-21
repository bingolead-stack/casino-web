import React from "react";
import styles from "./RewardCard.module.scss";

interface IRewardCardProps {
  title: string;
  value: string;
  color: string;
}

export default function RewardCard({ title, value, color }: IRewardCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.value} style={{ color }}>
        {value}
      </div>
    </div>
  );
}
