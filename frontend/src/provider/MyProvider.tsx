"use client";

import React, { ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  ledgerWallet,
  metaMaskWallet,
  phantomWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { WagmiProvider, createConfig, http } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  gnosis,
  bsc,
  avalanche,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
import { createClient } from "viem";
import AppPhantomWalletProvider from "./AppPhantomWalletProvider";
import { SocketProvider } from "@/context/SocketContext";
import { NextUIProvider } from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID || "";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        phantomWallet,
        argentWallet,
        ledgerWallet,
        trustWallet,
        rainbowWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: "My RainbowKit App",
    projectId: projectId,
  }
);

export const wagmiConfig = createConfig({
  connectors,
  chains: [mainnet, polygon, optimism, arbitrum, base, gnosis, bsc, avalanche],
  ssr: true, // If your dApp uses server side rendering (SSR),
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
});

const queryClient = new QueryClient();

interface MyProviderProps {
  children: ReactNode;
}

export const MyProvider: React.FC<MyProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <RecoilRoot>
            <AppPhantomWalletProvider>
              <SocketProvider>
                <NextUIProvider>{children}</NextUIProvider>
              </SocketProvider>
            </AppPhantomWalletProvider>
          </RecoilRoot>
          <ToastContainer
            pauseOnFocusLoss={false}
            theme="colored"
            stacked
            pauseOnHover
            autoClose={2000}
          />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
