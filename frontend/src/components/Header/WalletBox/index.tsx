import React, { useCallback, useState, useEffect } from "react";
import styles from "./WalletBox.module.scss";
import { useRecoilState } from "recoil";
import { userState } from "@/state/userState";
import {
  Modal,
  ModalBody,
  ModalContent,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import { FaChevronDown, FaChevronUp, FaExchangeAlt } from "react-icons/fa";
import Balance from "@/components/Balance";
import { tokenListState } from "@/state/tokenListState";
import { supportingTokenFields } from "@/config/constants";
import { selectedTokenState } from "@/state/selectedTokenState";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { usePathname } from "@/i18n/routing";
import { toast } from "react-toastify";
import { apiExchangeCrypto } from "@/api/wallet/apiExchangeCrypto";
import { numberRound } from "@/helpers/numberRound";

export default function WalletBox() {
  const [openWalletBox, setOpenWalletBox] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [selectedToken, setSelectedToken] = useRecoilState(selectedTokenState);
  const [viewInUsd, setViewInUsd] = useState(true);
  const [tokenList] = useRecoilState(tokenListState);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const pathname = usePathname();
  const [modalOpen, setModalOpen] = useState(false);
  const [source, setSource] = useState("8086");
  const [destination, setDestination] = useState("18087");
  const [amount, setAmount] = useState("0");

  const tokenPrice = useCallback(
    (field: string) => {
      return tokenList.find((t) => t.dbField === field)?.usdPrice || 1;
    },
    [tokenList]
  );

  const selectToken = (tokenName: string) => {
    window.localStorage.setItem("tokenName", tokenName);
    setSelectedToken(tokenName);
    setOpenWalletBox(false);
  };

  useEffect(() => {
    if (pathname.startsWith("/game/")) {
      console.log("Switched the token, refreshing game...");
      //should implement reload, but required?
    }
  }, [selectedToken]);

  const onExchange = (maxAmount: number) => {
    if (!source || !destination || !amount) {
      toast.error("Fill all the fields");
      return;
    }

    if (source == destination) {
      toast.error("Choose different cryptos to exchange");
      return;
    }

    if (parseFloat(amount) < 0) {
      toast.error("Please input amount larger than 0");
      return;
    }

    if (parseFloat(amount) > maxAmount) {
      toast.error("Amount exceeds the limit");
      return;
    }

    (async () => {
      try {
        const balance = await apiExchangeCrypto({
          sourceToken: source,
          destToken: destination,
          balance: parseFloat(amount),
        });
        if (balance) {
          toast.success("Succeed");
          setUser((prevUser) =>
            prevUser
              ? {
                  ...prevUser,
                  ["cash_" + source]: balance["cash_" + source] || 0,
                  ["cash_" + destination]: balance["cash_" + destination] || 0,
                }
              : null
          );
          setModalOpen(false);
        } else {
          toast.error("Something went wrong");
        }
      } catch (ex) {
        console.log(ex);
        toast.error("Something went wrong");
      }
    })();
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.walletToken}
        onClick={() => setOpenWalletBox(true)}
      >
        <img
          src={tokenList.find((e) => e.dbField === selectedToken)?.tokenIcon}
          alt="token"
          className="w-[20px] h-[20px] rounded-full"
        />
        <span
          className={
            "text-[14px] leading-[27px] font-semibold text-[#FFFFFFB7] " +
            styles.symbol
          }
        >
          {tokenList.find((e) => e.dbField === selectedToken)?.tokenSymbol}
        </span>
        {openWalletBox ? (
          <FaChevronUp color="#FFFFFFB7" size={isMobile ? 10 : 14} />
        ) : (
          <FaChevronDown color="#FFFFFFB7" size={isMobile ? 10 : 14} />
        )}
      </div>
      <div className={styles.walletBalance}>
        $
        <Balance balance={user?.["cash_" + selectedToken] || 0} digits={100} />
      </div>
      {openWalletBox && (
        <>
          <div
            className="fixed bg-[#0000] top-0 left-0 w-full h-full"
            onClick={() => setOpenWalletBox(false)}
          />
          <div className={styles.walletDropdown}>
            <div className="flex flex-col items-center justify-center md:p-[18px] p-[10px]">
              <span className="uppercase text-[#FFFFFF8E] text-[12px] leading-[18px]">
                Total Balance
              </span>
              <span className="font-semibold text-[#FFF] uppercase md:text-[25px] text-[20px] md:leading-[36px] leading-[24px]">
                <Balance balance={user?.cash || 0} digits={100} />
                &nbsp;
                <span className="text-[#FFFFFF8E]">USD</span>
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between items-center py-[11px] px-[18px] uppercase border-t-1 border-b-1 border-[#FFFFFF0A] font-semibold text-[11px] leading-[18px]">
                <div>Coins</div>
                <div>Balance</div>
              </div>
              <div className="md:py-[9px] py-[4px] flex flex-col overflow-y-auto max-h-[300px]">
                {supportingTokenFields.map((field) => (
                  <div
                    key={field}
                    onClick={() => selectToken(field)}
                    className="flex justify-between items-center md:py-[11px] py-[6px] px-[18px] font-semibold text-[14px] leading-[24px] hover:bg-[#272D3C]"
                  >
                    <div className="flex items-center gap-[18px]">
                      <img
                        src={
                          tokenList.find((t) => t.dbField === field)?.tokenIcon
                        }
                        alt="token"
                        className="w-[20px] h-[20px] rounded-full"
                      />
                      <span className="text-[#FFFFFF] uppercase">
                        {
                          tokenList.find((t) => t.dbField === field)
                            ?.tokenSymbol
                        }
                      </span>
                    </div>
                    <Balance
                      balance={
                        viewInUsd
                          ? user?.["cash_" + field] || 0
                          : (user?.["cash_" + field] || 0) / tokenPrice(field)
                      }
                      digits={viewInUsd ? 100 : 10000}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-row items-center py-[14px] px-[18px] border-t-1 border-[#FFFFFF0A] gap-[10px]">
              <button
                className="btn btn-primary"
                style={{borderRadius: "72px", minHeight:"32px", height: "32px", padding:"0 16px"}}
                onClick={() => setModalOpen(true)}
              >
                <FaExchangeAlt />
              </button>
              <div className="flex flex-row ml-auto gap-[10px]">
                <span>
                  View in <span className="text-[#FFF]">USD</span>
                </span>
                <Switch
                  size="sm"
                  className="p-0 m-0"
                  color="success"
                  isSelected={viewInUsd}
                  onValueChange={setViewInUsd}
                />
              </div>
            </div>
          </div>
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            backdrop="blur"
          >
            <ModalContent className="px-[12px] py-[32px]">
              <ModalBody>
                <h2> Exchange Dialog </h2>
                <div className="flex flex-col gap-[10px]">
                  <Select
                    className="max-w-lg"
                    label="Source"
                    defaultSelectedKeys={["8086"]}
                    isRequired
                    selectionMode="single"
                    disallowEmptySelection
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  >
                    {supportingTokenFields.map((field) => (
                      <SelectItem
                        key={field}
                        startContent={
                          <div className="flex flex-row items-center gap-[24px]">
                            <img
                              src={
                                tokenList.find((t) => t.dbField === field)
                                  ?.tokenIcon
                              }
                              alt="token"
                              className="w-[20px] h-[20px] rounded-full"
                            />
                          </div>
                        }
                      >
                        {tokenList.find((t) => t.dbField === field)
                          ?.tokenSymbol +
                          "  $" +
                          numberRound(user?.["cash_" + field] || 0, 10000)}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    className="max-w-lg"
                    label="Destination"
                    defaultSelectedKeys={["18087"]}
                    isRequired
                    selectionMode="single"
                    disallowEmptySelection
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  >
                    {supportingTokenFields.map((field) => (
                      <SelectItem
                        key={field}
                        startContent={
                          <div className="flex flex-row items-center gap-[24px]">
                            <img
                              src={
                                tokenList.find((t) => t.dbField === field)
                                  ?.tokenIcon
                              }
                              alt="token"
                              className="w-[20px] h-[20px] rounded-full"
                            />
                          </div>
                        }
                      >
                        {tokenList.find((t) => t.dbField === field)
                          ?.tokenSymbol +
                          "  $" +
                          numberRound(user?.["cash_" + field] || 0, 10000)}
                      </SelectItem>
                    ))}
                  </Select>

                  <input
                    type="number"
                    className="px-[24px] py-[12px] text-[16px] text-white rounded-[12px] bg-[#313131]"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <button
                    className="btn btn-primary gap-[10px] mt-[12px]"
                    onClick={() => onExchange(user?.["cash_" + source] || 0)}
                  >
                    <FaExchangeAlt /> Exchange{" "}
                  </button>
                </div>
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}
    </div>
  );
}
