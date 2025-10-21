import React from "react";
import styles from "./Page.module.scss";

export default function PageComponent() {
  return (
    <div className="flex flex-col gap-[24px]">
      <div className={styles.paragraph}>
        <h2 className={styles.heading2}>Leaderboard Rules</h2>
      </div>
      <div className={styles.paragraph}>
        <h3 className={styles.heading3}>Eligibility</h3>
        <div>
          The leaderboard bonuses are awarded to the top 10 usernames with the
          highest total wagers.
        </div>
      </div>
      <div className={styles.paragraph}>
        <h3 className={styles.heading3}>Prize Allocation</h3>
        <div>
          Each of the top 10 positions will receive a specific money prize.
        </div>
      </div>
      <div className={styles.paragraph}>
        <h3 className={styles.heading3}>Wagering Requirement</h3>
        <div>
          To be eligible to withdraw the leaderboard bonus, the prize must be
          wagered at least 10x (ten times) the winning amount.
        </div>
      </div>
      <div className={styles.paragraph}>
        <h3 className={styles.heading3}>Wagering Process</h3>
        <div>
          The bonus must be wagered on real-money games at the casino. Once the
          required wagering has been met, the prize will be available for
          withdrawal.
        </div>
      </div>
      <div className={styles.paragraph}>
        <h3 className={styles.heading3}>Failure to Meet Requirements</h3>
        <div>
          If the required wager is not completed, the bonus prize will be
          forfeited.
        </div>
      </div>
      <div>
        Please make sure to check the casino&apos;s full terms and conditions for
        further details.
      </div>
    </div>
  );
}
