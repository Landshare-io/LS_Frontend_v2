import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Inter_Tight } from 'next/font/google';
import Button from "../common/button";
import useLogin from "../../hooks/nft-game/axios/useLogin";
import { useGlobalContext } from "../../context/GlobalContext";
import { MAJOR_WORK_CHAIN } from "../../config/constants/environments";
import { useSearchParams } from 'next/navigation';
import { Fuul } from "@fuul/sdk";
import { signMessage } from '@wagmi/core';
import { config } from "../../wagmi";
import { useAccount } from "wagmi";

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
  const searchParams = useSearchParams();
  const { pathname } = router;
  const { checkIsAuthenticated } = useLogin()
  const { isAuthenticated } = useGlobalContext()
  const referralCode = searchParams.get('af');
  const {isConnected, address} = useAccount();

  const formatAffiliateAcceptance = (date : any) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedDate = `${day}-${month} ${year} ${hours}:${minutes}:${seconds}`;
    return `Accept affiliate on ${formattedDate}`;
}

  useEffect(() => {
    const fetchData = async () => {
      const signature = await signMessage(config, { message: formatAffiliateAcceptance(new Date())});

      await Fuul.sendConnectWallet({
        address: address as string,
        signature: signature,
        message: formatAffiliateAcceptance(new Date())
      });
    }

    if(isConnected && address && referralCode){
      fetchData();
    }
  }, [isConnected])
    

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
                      className={`text-[#fff] px-[24px] py-[13px] w-full rounded-[100px] ${interTight.className} ${connectButtonClassName ?? ''}`}
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

                if (pathname.includes('/nft') && chain.id == MAJOR_WORK_CHAIN.id && !isAuthenticated) {
                  return (
                    <Button 
                      onClick={() => checkIsAuthenticated(account?.address)}
                      className="px-[44px] py-[13px] rounded-[100px] transition ease-in-out delay-400 hover:bg-transparent border-[1px] border-[#61CD81] text-[#fff] hover:text-[#61CD81]"
                      textClassName="hover:dark:text-[#61CD81]"
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
                        className="px-[44px] py-[13px] rounded-[100px] transition ease-in-out delay-400 hover:bg-transparent border-[1px] border-[#61CD81] text-[#fff] hover:text-[#61CD81]"
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
