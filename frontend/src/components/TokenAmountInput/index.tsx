import { useMemo, useState } from "react";
import styles from "./TokenAmountInput.module.scss";
import { numberRound } from "@/helpers/numberRound";

interface TokenAmountInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  usdPrice: number;
  tokenSymbol: string;
}

export default function TokenAmountInput(props: TokenAmountInputProps) {
  const tokenAmount = useMemo(
    () => numberRound(+(props.value || "0") / props.usdPrice, 10000),
    [props.value, props.usdPrice]
  );

  const inputProps = useMemo(() => {
    const props1: any = { ...props };
    delete props1.usdPrice;
    delete props1.tokenSymbol;
    return props1;
  }, [props]);

  return (
    <div className={styles.tokenAmountInput}>
      <input {...inputProps} />
      <div className={styles.token}>{tokenAmount} {props.tokenSymbol}</div>
      <div className={styles.usd}>$</div>
    </div>
  );
}
