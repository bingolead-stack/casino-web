import styles from "./ProviderGroup.module.scss";
import React, { useMemo } from "react";
import ProviderFilter from "../ProviderFilter";
import { useRecoilState } from "recoil";
import { providerState } from "@/state/providerState";
import { Link } from "@/i18n/routing";
import MySwiper from "../MySwiper";
import { SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation } from "swiper/modules";
import { providerIcons } from "./data";

const providerImages = [
  "3oaks",
  "amusnet",
  "backseat",
  "belatra",
  "betgames",
  "betsoft",
  "bgaming",
  "blueprint",
  "endorphina",
  "evo-big-time-gaming",
  "evo-evolution",
  "evolution",
  "evo-netent",
  "evoplay",
  "ezugi",
  "habanero",
  "hacksaw",
  "macksaw",
  "mascot",
  "nolimitcity",
  "onlyplay",
  "platipus",
  "playingo",
  "playson",
  "push-gaming",
  "redtiger",
  "rubyplay",
  "spadegaming",
  "tada",
  "thunderkick",
  "yggdr",
];

export default function ProviderGroup() {
  const [provider] = useRecoilState(providerState);
  const providerList = useMemo(
    () =>
      provider.array
        .filter((p) => p.added_slot)
        .sort((a, b) => (a.order < b.order ? -1 : 1)),
    [provider]
  );

  return (
    <div className={styles.providerGroup}>
      <div className={styles.titleBar}>
        <div className={styles.title}>
          <div className={styles.text}>Providers</div>
        </div>
        <ProviderFilter />
      </div>
      <MySwiper
        modules={[Mousewheel, Navigation]}
        className={styles.providers}
        spaceBetween={6}
        slidesPerView="auto"
        onSlideChange={() => console.log("slide change")}
      >
        {providerList.map((p) => (
          <SwiperSlide key={p.provider} className={styles.providerItem}>
            <Link
              href={`/slots/all?providerId=${p.provider}`}
              className={styles.provider}
            >
              {providerImages.includes(p.provider) ? (
                <div className="flex items-center justify-center w-[100px] h-full py-[8px]">
                  <img
                    src={"/images/providers/" + p.provider + ".png"}
                    alt={p.provider}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <>
                  {providerIcons[p.provider] && (
                    <div className="flex items-center justify-center w-[24px] h-[24px]">
                      {providerIcons[p.provider]}
                    </div>
                  )}
                  <div className={styles.providerName}>{p.provider}</div>
                </>
              )}
            </Link>
          </SwiperSlide>
        ))}
      </MySwiper>
    </div>
  );
}
