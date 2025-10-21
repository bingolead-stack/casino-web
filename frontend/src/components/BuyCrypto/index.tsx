"use client";

import styles from "./BuyCrypto.module.scss";

const images = [
  "/images/visa.png",
  "/images/card.png",
  "/images/apple-pay.png",
  "/images/google-pay.png",
];

export default function BuyCrypto() {
  return (
    <div className={styles.container}>
      <div className="flex flex-col items-center md:items-start">
        <div className="md:text-[20px] text-[16px] text-[#FFF]">
          Buy crypto instantly and easily
        </div>
        <div className="md:text-[18px] text-[14px] text-[#FFFFFFB7] md:text-left text-center">
          Choose from a wide array of available payment options.
        </div>
      </div>
      <div className="md:ml-auto flex gap-[9px]">
        {images.map((e) => (
          <div
            key={e}
            className="w-[54px] h-[36px] flex items-center justify-center bg-[#1C202A] rounded-[9px] px-[9px] py-[5px]"
          >
            <img src={e} alt="visa" />
          </div>
        ))}
      </div>
      <button className="btn btn-primary ml-[28px]">Buy Crypto</button>
    </div>
  );
}
