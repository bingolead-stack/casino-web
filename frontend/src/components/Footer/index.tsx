"use client";

import React from "react";
import styles from "./Footer.module.scss";
import { Link, usePathname } from "@/i18n/routing";
import Image from "next/image";
import Script from "next/script";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";

const chainImages = [
  "/images/tokens/abstract-logo.png",
  "/images/tokens/solana-sol-logo.png",
  "/images/tokens/avalanche-avax-logo.png",
  "/images/tokens/bitcoin-btc-logo.png",
  "/images/tokens/bnb-bnb-logo.png",
  "/images/tokens/ethereum-eth-logo.png",
  "/images/tokens/tether-usdt-logo.png",
  "/images/tokens/tron-trx-logo.png",
  "/images/tokens/usd-coin-usdc-logo.png",
  "/images/tokens/xrp.png",
];

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const isMobile = useMediaQuery(mobileMediaQuery);

  if (pathname.startsWith("/sports/en")) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.footerContent}>
          <div className={styles.premium}>
            <div className={styles.description}>
              <Link className={styles.logo} href="/">
                <img src="/images/logo.png" alt="Casino" className="h-[86px]" />
              </Link>
              <div>© 2025 Casino.bet - All rights reserved.</div>
            </div>
          </div>
          <div className={styles.shortcuts}>
            <div className={styles.shortcutGroup}>
              <h5>Games</h5>
              <ul className="grid-cols-1">
                <li>
                  <Link href="/">Casino</Link>
                </li>
                <li>
                  <Link href="/sports/en">Sports</Link>
                </li>
              </ul>
            </div>
            <div className={styles.shortcutGroup}>
              <h5>About Us</h5>
              <ul className="grid-cols-1">
                <li>
                  <Link href="/about_us">About Us</Link>
                </li>
                <li>
                  <Link href="/responsible_gaming">Responsible Gaming</Link>
                </li>
                <li>
                  <Link href="/profile/affiliates/overview">
                    Affiliate Program
                  </Link>
                </li>
                <li>
                  <Link href="#">Promotions</Link>
                </li>
              </ul>
            </div>
            <div className={styles.shortcutGroup}>
              <h5>Help</h5>
              <ul className="grid-cols-1">
                <li>
                  <Link href="/privacy_policy/aml-policy">AML Web Policy</Link>
                </li>
                <li>
                  <Link href="/privacy_policy/anti-fraud-policy">
                    Anti-Fraud Policy
                  </Link>
                </li>
                <li>
                  <Link href="/privacy_policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/wallet/deposit/privacy-policy">
                    Deposit Policy
                  </Link>
                </li>
                <li>
                  <Link href="/privacy_policy/leaderboard_rules">
                    Leaderboard Rules
                  </Link>
                </li>
                <li>
                  <Link href="#">FAQs</Link>
                </li>
                <li>
                  <Link href="/contact_us">Contact Us</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:max-w-[250px]">
            <h5>Accepted Cryptocurrencies</h5>
            <div className={styles.chains}>
              {chainImages.map((e) => (
                <Image key={e} src={e} width={27} height={27} alt="Chain" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footerLine}>
        <div className="flex gap-4">
          <img
            src="/images/logo.png"
            alt="Casino"
            className="h-[60px] w-[auto]"
          />
          {/* <div
            id="anj-dfb505a5-e5c9-47cb-bfcd-8e214d7ffd21"
            data-anj-seal-id="dfb505a5-e5c9-47cb-bfcd-8e214d7ffd21"
            data-anj-image-size="64"
            data-anj-image-type="basic-small"
          /> */}
        </div>
        {/* <div className={styles.descriptionText}>
          <b>{location.host}</b>: Online Casino. Best online slots, live casino
          games, sports betting. We offer fast withdrawals, 24/7 support. &nbsp;
          <b>{location.host}</b> is owned and operated by&nbsp;
          <span className="text-[#FFFFFF]">Furysbet Ltd</span> with registration
          number: <span className="text-[#FFFFFF]">30867</span>, registered
          address:{" "}
          <span className="text-[#FFFFFF]">
            9 Barrack Road, Belize City, Belize
          </span>
          . Contact us <b>{location.host}</b>
          <br />
          <br />
          <b>{location.host}</b> is licensed and regulated by the Government of
          the Autonomous Island of Anjouan, Union of Comoros and operates under
          &nbsp;
          <span className="text-[#FFFFFF]">License No. ALSI-192407064-FI3</span>
          . <b>{location.host}</b> has passed all regulatory compliance and is
          legally authorized to conduct gaming operations for any and all games
          of chance and wagering. Remember that gambling can be addictive. Play
          responsibly.
        </div> */}
      </div>
{/* 
      <Script src="https://sortee.bet/seal.js" />
      <Script
        type="text/javascript"
        src="https://dfb505a5-e5c9-47cb-bfcd-8e214d7ffd21.snippet.anjouangaming.io/anj-seal.js"
      /> */}
    </footer>
  );
};
