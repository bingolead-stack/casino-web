import dynamic from "next/dynamic";

const Withdraw = dynamic(() => import("./Withdraw"), { ssr: false });

export default function WithdrawPage() {
  return <Withdraw />;
}
