import React from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Inter_Tight } from 'next/font/google';
import Button from "../common/button";
import useLogin from "../../hooks/nft-game/axios/useLogin";
import { useGlobalContext } from "../../context/GlobalContext";
import { MAJOR_WORK_CHAIN } from "../../config/constants/environments";

const interTight = Inter_Tight({
  weight: "700",
  style: "normal",
  preload: false,
});

interface ConnectWalletProps {
  containerClassName?: string
  connectButtonClassName?: string
}

export default function ConnectWallet({
  containerClassName,
  connectButtonClassName
}: ConnectWalletProps) {
  const router = useRouter();
  const { pathname } = router;
  const { checkIsAuthenticated } = useLogin()
  const { isAuthenticated } = useGlobalContext()

  return (
    <>
      <Head>
        <title>Landshare</title>
      </Head>
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
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === "authenticated");

          return (
            <div className={`flex ${containerClassName}`}>
              {(() => {
                if (!connected) {
                  return (
                    <Button
                      className={`w-[165px] h-[44px] text-[#fff] rounded-[100px] bg-[#61cd81] ${interTight.className} ${connectButtonClassName ?? ''}`}
                      textClassName="hover:dark:text-[#61CD81] text-[100%]"
                      onClick={openConnectModal}
                    >
                      Connect Wallet
                    </Button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <Button
                      onClick={openChainModal}
                      className={`w-[165px] h-[44px] text-[#fff] rounded-[100px] transition ease-in-out delay-400 bg-[#61cd81] hover:bg-transparent border-[1px] border-[#61CD81] hover:text-[#61CD81] ${interTight.className}`}
                      textClassName="hover:dark:text-[#61CD81] text-[100%]"
                    >
                      Wrong network
                    </Button>
                  );
                }

                if (pathname.includes('/nft') && chain.id == MAJOR_WORK_CHAIN.id && !isAuthenticated) {
                  return (
                    <Button 
                      onClick={() => checkIsAuthenticated(account?.address)}
                      className="w-[165px] h-[44px] rounded-[100px] transition ease-in-out delay-400 bg-[#61cd81] hover:bg-transparent border-[1px] border-[#61CD81] text-[#fff] hover:text-[#61CD81]"
                      textClassName="hover:dark:text-[#61CD81] text-[100%]"
                    >
                      Login
                    </Button>
                  );
                } else {
                  return (
                    <div className="flex items-center">
                      <div
                        onClick={openChainModal}
                        className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-primary hover:bg-gray-200 transition-colors duration-200 mr-2"
                      >
                        <img
                          src={chain.iconUrl}
                          alt={chain.name}
                          className="w-6 h-6"
                        />
                      </div>
                      <Button
                        onClick={openAccountModal}
                        className="w-[165px] h-[44px] rounded-[100px] transition ease-in-out delay-400 bg-[#61cd81] hover:bg-transparent border-[1px] border-[#61CD81] text-[#fff] hover:text-[#61CD81]"
                        textClassName="hover:dark:text-[#61CD81] text-[100%]"
                      >
                        {account.displayName}
                      </Button>
                    </div>
                  );
                }
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </>
  );
}
