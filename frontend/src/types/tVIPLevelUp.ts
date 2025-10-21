export type tVIPLevelUp = {
  level: number;
  vipTitle: string;
  icon: React.ReactNode;
  wagerAmount: number;
  conditions: {
    rakeback: number; // %
    cashback: number; // %
    levelUpBonus: number; // $
    cashbackPeriod: "weekly" | "bio-weekly" | "tri-weekly" | "daily";
    bPrivateVIPPromotions: boolean;
    bCustomizedBonuses: boolean;
    bDedicatedVIPhost: boolean;
  };
  background: string;
  color: string;
};
