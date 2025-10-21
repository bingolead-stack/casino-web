import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaWallet } from "react-icons/fa6";
// import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { SolanaWalletButton } from "./SolanaWalletButton";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { isMobileDevice } from "@/helpers/isMobileDevice";
import { isMyApp } from "@/helpers/isMyApp";

const WalletConnectButton = () => {
  const { publicKey } = useWallet();

  const connectPhantomWallet = async () => {
    try {
      if (isMobileDevice()) {
        // Mobile-specific handling
        const phantomURL = `https://phantom.app/ul/v1/connect?app_url=${encodeURIComponent(
          window.location.href
        )}`;
        (window as any).location.href = phantomURL;
      } else {
        // Desktop handling
        const provider = (window as any).solana;
        await provider.connect();
      }
    } catch (error) {
      console.error("Error connecting to Phantom wallet:", error);
    }
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected = ready && account && chain;

        if (!connected && !publicKey) {
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button className="btn btn-primary btn-wallet">Wallet</Button>
              </DropdownTrigger>

              {isMyApp() ? (
                <DropdownMenu className="wallet-connect">
                  <DropdownItem
                    onClick={openConnectModal}
                    className="dropdown-menu-item"
                  >
                    Ethereum
                  </DropdownItem>
                </DropdownMenu>
              ) : (
                <DropdownMenu className="wallet-connect">
                  <DropdownItem
                    onClick={openConnectModal}
                    className="dropdown-menu-item"
                  >
                    Ethereum
                  </DropdownItem>
                  <DropdownItem className="dropdown-menu-item">
                    <SolanaWalletButton />
                  </DropdownItem>
                </DropdownMenu>
              )}
            </Dropdown>
          );
        }

        if (publicKey) {
          return (
            <div className="solana-connected">
              <WalletMultiButton />
            </div>
          );
        }

        if (connected) {
          if (chain.unsupported) {
            return (
              <button
                onClick={openChainModal}
                type="button"
              >
                Wrong network
              </button>
            );
          }

          return (
            <div className="flex items-center gap-2 h-full">
              <Button
                onClick={openAccountModal}
                type="button"
                className="btn btn-primary btn-wallet"
              >
                {account.displayName.slice(0, 4) +
                  "..." +
                  account.displayName.slice(-4)}
              </Button>
            </div>
          );
        }

        return null;
      }}
    </ConnectButton.Custom>
  );
};

export default WalletConnectButton;
