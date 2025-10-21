import { vipData } from "@/config/vipData";

interface IVIPLevelChipProps {
  level: number;
}

export default function VIPLevelChip({ level }: IVIPLevelChipProps) {
  return (
    <span
      className="rounded-full text-[11px] px-[9px] py-[6px] font-semibold"
      style={{
        color: vipData[level].color,
        background: vipData[level].background,
      }}
    >
      VIP{level}
    </span>
  );
}
