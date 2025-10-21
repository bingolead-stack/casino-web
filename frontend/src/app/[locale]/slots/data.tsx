import IconAllGames from "@/assets/icons/game-navbar/all-games.svg";
import IconBuyBonus from "@/assets/icons/game-navbar/buy-bonus.svg";
import IconInstantGames from "@/assets/icons/game-navbar/instant-games.svg";
import IconJackpot from "@/assets/icons/game-navbar/jackpot.svg";
import IconHot from "@/assets/icons/game-navbar/hot.svg";
import IconReleases from "@/assets/icons/game-navbar/releases.svg";
import IconPopularAsia from "@/assets/icons/game-navbar/popular-asia.svg";
import IconClassic from "@/assets/icons/game-navbar/classic.svg";

export const navItems = (width: number) => [
  {
    icon: <IconAllGames width={width} height={width} viewBox="0 0 40 40" />,
    text: "All Games",
    id: "all-games",
  },
  {
    icon: <IconBuyBonus width={width} height={width} viewBox="0 0 40 40" />,
    text: "Buy Bonus",
    id: "buy-bonus",
    isCustom: true,
    type: "slot-buy-bonus",
  },
  {
    icon: <IconInstantGames width={width} height={width} viewBox="0 0 40 40" />,
    text: "Instant Games",
    id: "instant-games",
    isCustom: true,
    type: "slot-instant",
  },
  {
    icon: <IconJackpot width={width} height={width} viewBox="0 0 40 40" />,
    text: "Jackpot",
    id: "Jackpot",
    type: "slot-jackpot",
    isCustom: true,
  },
  {
    icon: <IconHot width={width} height={width} viewBox="0 0 40 40" />,
    text: "Hot",
    id: "hot",
    type: "slot-hot",
    isCustom: true,
  },
  {
    icon: <IconReleases width={width} height={width} viewBox="0 0 40 40" />,
    text: "Releases",
    id: "releases",
    type: "slot-new",
    isCustom: true,
  },
  {
    icon: <IconPopularAsia width={width} height={width} viewBox="0 0 40 40" />,
    text: "Popular Asia",
    id: "popular-asia",
    isCustom: true,
    type: "slot-asia",
  },
  {
    icon: <IconClassic width={width} height={width} viewBox="0 0 40 40" />,
    text: "Classic",
    id: "classic",
    type: "slot-classic",
    isCustom: true,
  },
];

export const promotionImages = [
  "/images/banners/110_deposit_t51_05.png",
  "/images/banners/110_deposit_t51_051.png",
  "/images/banners/referral_bonus_052.png",
]