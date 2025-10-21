import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Modal,
  ModalBody,
  ModalContent,
  Input,
  Button,
} from "@nextui-org/react";
import { CountryDropdown } from "react-country-region-selector";
import { toast } from "react-toastify";
import { apiPayWithVisa } from "@/api/wallet/apiPayWithVisa";

export default function VisaDepositDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const locale = useLocale();
  const t = useTranslations("Wallet");
  const dir = locale == "en" ? "ltr" : "rtl";
  const [fullName, setFullName] = useState("");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");

  const onDeposit = (
    fullName: string,
    amount: string,
    email: string,
    phone: string,
    country: string
  ) => {
    const valAmount = parseFloat(amount);
    if (isNaN(valAmount) || valAmount < 50) {
      toast.error("Invalid amount. Minimum deposit amount is 50");
      return;
    }
    if (!fullName.trim() || !email.trim() || !phone.trim() || !country.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address");
      return;
    }
    if (phone.trim().length != 10) {
      toast.error("Invalid phone number. Please input 10 digits number");
      return;
    }
    setIsLoading(true);
    (async () => {
      try {
        const redirectUrl =
          "https://www.Casino.com/" + locale + "/wallet/deposit";
        const res = await apiPayWithVisa({
          fullName,
          amount: valAmount,
          email,
          phone,
          country,
          redirectUrl,
        });
        console.log(res);
        setIsLoading(false);
        if (!res) {
          toast.error("Something went wrong");
          return;
        }
        onClose();
        toast.info("Redirecting to the payment page");
        window.open(res["3DSUrl"], "_blank");
      } catch (ex) {
        setIsLoading(false);
        toast.error("Something went wrong");
        console.log(ex);
        return;
      }
    })();
    onClose();
  };

  useEffect(() => {
    setFullName("");
    setAmount("");
    setEmail("");
    setPhone("");
    setCountry("");
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      backdrop="blur"
      onClose={onClose}
      className="my-dialog deposit-dialog"
      dir={dir}
    >
      <ModalContent>
        <ModalBody className="my-dialog-body">
          <div className="flex flex-col gap-4">
            <h2
              className={
                "text-white text-[18px] font-semibold mb-[8px] w-full " +
                (locale == "en" ? "text-left" : "text-right")
              }
            >
              Payment with VISA
            </h2>
            <Input
              label="Fullname"
              placeholder="Enter the fullname"
              variant="bordered"
              autoFocus
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input
              label="Amount in USD"
              type="number"
              placeholder="Enter the amount at least 50"
              variant="bordered"
              startContent="$"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Input
              label="Email"
              placeholder="Enter the email"
              variant="bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Phone"
              placeholder="Enter the phone number with 10 digits"
              variant="bordered"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <CountryDropdown
              value={country}
              onChange={(val) => setCountry(val)}
              defaultOptionLabel="Select a country"
              className="country"
              valueType="short"
              style={{
                padding: "10px",
                borderRadius: "8px",
                background: "#23243f",
                border: "2px solid #444",
              }}
            />
            <Button
              className="btn btn-primary"
              isLoading={isLoading}
              onClick={() => onDeposit(fullName, amount, email, phone, country)}
            >
              Deposit
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
