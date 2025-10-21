import VisaDepositDialog from "./VisaDepositDialog";
import { useState } from "react";

export default function BuyCrypto() {
  const [visaDialogOpened, setVisaDialogOpened] = useState(false);

  return (
    <div className="buy-crypto-card">
      <div className="title">Buy Crypto</div>
      <div className="list-box">
        <img
          src="/images/card.png"
          alt="card"
          // onClick={() => setVisaDialogOpened(true)}
        />
        <img
          src="/images/visa.png"
          alt="visa"
          // onClick={() => setVisaDialogOpened(true)}
        />
        <img src="/images/apple-pay.png" alt="apple-pay" />
        <img src="/images/google-pay.png" alt="google-pay" />
      </div>
      {/* <VisaDepositDialog
        isOpen={visaDialogOpened}
        onClose={() => setVisaDialogOpened(false)}
      /> */}
    </div>
  );
}
