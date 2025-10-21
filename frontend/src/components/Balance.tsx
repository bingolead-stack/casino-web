import { numberRound } from "@/helpers/numberRound";

interface IBalanceProps {
  balance: number;
  digits: number;
}

export default function Balance({ balance, digits }: IBalanceProps) {
  return (
    <span>
      <span className="text-[#FFF]">
        {balance < 0
          ? "-" + Math.floor(-balance).toLocaleString()
          : Math.floor(balance).toLocaleString()}
      </span>
      <span className="text-[#FFFFFF8E]">
        {balance < 0
          ? numberRound(-balance - Math.floor(-balance), digits)
              .toString()
              .substring(1)
          : numberRound(balance - Math.floor(balance), digits)
              .toString()
              .substring(1)}
      </span>
    </span>
  );
}
