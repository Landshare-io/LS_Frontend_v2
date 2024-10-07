import React from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Inter_Tight } from 'next/font/google';
import Button from "../common/button";
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
                      className={`text-[#fff] px-[24px] py-[13px] w-full rounded-[100px] ${interTight.className} ${connectButtonClassName}`}
                      textClassName="hover:dark:text-[#61CD81]"
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
                      className={`text-[#fff] px-[24px] py-[13px] rounded-[100px] transition ease-in-out delay-400 hover:bg-transparent border-[1px] border-[#61CD81] hover:text-[#61CD81] ${interTight.className}`}
                      textClassName="hover:dark:text-[#61CD81]"
                    >
                      Wrong network
                    </Button>
                  );
                }

                if (pathname.includes('/nft') && chain.id == MAJOR_WORK_CHAIN.id) { // !isAuthenticated && 
                  return (
                    <></>
                    // <button onClick={() => checkIsAuthenticated()} type="button-container" className="nav-btn bg-[#61CD81] text-button-text-secondary">
                    //   Login
                    // </button>
                  );
                } else {
                  return (
                    <div className="flex items-center">
                      <div
                        onClick={openChainModal}
                        className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors duration-200 mr-2"
                      >
                        <img
                          src={chain.iconUrl}
                          alt={chain.name}
                          className="w-6 h-6"
                        />
                      </div>
                      <Button
                        onClick={openAccountModal}
                        className="text-[#fff] px-[44px] py-[13px] rounded-[100px] transition ease-in-out delay-400 hover:bg-transparent border-[1px] border-[#61CD81] hover:text-[#61CD81]"
                        textClassName="hover:dark:text-[#61CD81]"
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
