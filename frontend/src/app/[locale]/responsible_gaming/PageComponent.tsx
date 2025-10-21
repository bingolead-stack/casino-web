import React from "react";
import styles from "./Page.module.scss";
import { Link } from "@/i18n/routing";
import { FaPlay } from "react-icons/fa";
import { data } from "./data";
export default function PageComponent() {
  return (
    <div className={styles.container}>
      <div className={styles.bubble}>
        <img src="/images/lamp.png" alt="card" className="w-[72px] h-[72px]" />
        <div className={styles.infos}>
          <div className={styles.title}>Gambling with Responsibility</div>
          <div className={styles.info}>
            Please read the following information carefully for your benefit.
            Virtuo Ltd Cyprus. operates Casino.bet, registered at Abraham de
            Veerstraat1, Willemstad, Curacao
          </div>
        </div>
        <Link
          className="btn btn-primary h-[45px] flex flex-row whitespace-nowrap gap-[9px]"
          type="button"
          href="/wallet/deposit"
        >
          Play now
          <FaPlay />
        </Link>
        <div className="absolute blur-[15px] bg-[var(--primary-color)] w-[75%] h-[18px] bottom-[-4px]" />
      </div>
      <div className={styles.bubbleColumn}>
        <div className={styles.h2}>Gambling with Responsibility</div>
        <div className={styles.h5}>
          For most players, gambling is a source of entertainment, fun, and
          excitement. However, for some, it may lead to negative consequences.
          As a leading provider of online gambling and sports betting, we are
          dedicated to ensuring that our customers gamble responsibly and avoid
          problems related to excessive or compulsive gambling.
        </div>
        <div className={styles.h5}>
          If you think you may be struggling with gambling or find it
          challenging to maintain control, we encourage you to contact our
          Support Team via Live Chat or by emailing{" "}
          <Link href="/wallet/deposit" className="text-[var(--primary-color)]">
            support@Casino.bet
          </Link>
          . We can activate preventive measures to exclude you from gambling on
          our platform for a period ranging from 1 month to 5 years. If you are
          concerned about a loved one who may be losing control, contact our
          Support Team, and we will handle the situation confidentially.
        </div>
        <div className={styles.h5}>
          You can also take a self-test to check for signs of gambling addiction
          by visiting the{" "}
          <Link href="/wallet/deposit" className="text-[var(--primary-color)]">
            BeGambleAware
          </Link>{" "}
          website
        </div>
      </div>
      <div className={styles.bubbleColumn}>
        <div className={styles.h2}>
          Useful Hints to Help You Stay in Control of Your Gambling
        </div>
        <div className={styles.h5}>
          Follow these tips to ensure gambling remains a positive experience:
        </div>
        <div className={styles.list}>
          {data.map((e) => (
            <div key={e.title} className={styles.listitem}>
              <div className={styles.symbol}>•</div>
              <div className={styles.itemtitle}>
                <div className={styles.h4}>{e.title}:</div>
                <div className={styles.h5}>{e.description}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.h5}>
          For parents, we recommend using internet filters to restrict access.
          Visit recommended{" "}
          <Link href="/wallet/deposit" className="text-[var(--primary-color)]">
            internet filters
          </Link>{" "}
          for more information.
        </div>
      </div>
    </div>
  );
}
