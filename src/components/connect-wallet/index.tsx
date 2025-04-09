import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import { useAccount } from "wagmi";
import ReactLoading from "react-loading";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Inter_Tight } from 'next/font/google';
import Button from "../common/button";
import useLogin from "../../hooks/nft-game/axios/useLogin";
import { useGlobalContext } from "../../context/GlobalContext";
import { MAJOR_WORK_CHAINS } from "../../config/constants/environments";
import { useSearchParams } from 'next/navigation';
import { Fuul } from "@fuul/sdk";
import { signMessage } from '@wagmi/core';
import { config } from "../../wagmi";

const NFT_MAJOR_WORK_CHAIN = MAJOR_WORK_CHAINS['/nft']

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
  const { checkIsAuthenticated, isLoading, logout } = useLogin()
  const { isAuthenticated } = useGlobalContext()
  const referralCode = searchParams.get('af');
  const {isConnected, address, status} = useAccount();

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
      if (isConnected && address) {
        logout(address)
        if (referralCode) {
          const message = formatAffiliateAcceptance(new Date());
          try {
            const signature = await signMessage(config, { message });
  
            await Fuul.sendConnectWallet({
              address: address,
              signature: signature,
              message: message
            });
          } catch (error) {
            console.error("Error signing message:", error);
          }
        }
      }
    }
    fetchData();
  }, [isConnected, address, referralCode])
    

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
                if (!mounted || authenticationStatus === "loading") {
                  return null;
                }

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

                if (pathname.includes('/nft') && (NFT_MAJOR_WORK_CHAIN.map(chains => chains.id) as number[]).includes(chain.id) && !isAuthenticated) {
                  return (
                    <Button 
                      onClick={() => checkIsAuthenticated(account?.address)}
                      className="w-[165px] h-[44px] rounded-[100px] transition ease-in-out delay-400 bg-[#61cd81] hover:bg-transparent border-[1px] border-[#61CD81] text-[#fff] hover:text-[#61CD81]"
                      textClassName="hover:dark:text-[#61CD81] text-[100%]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className='flex justify-center items-center'>
                          <ReactLoading
                            type="spin"
                            className="me-2 mb-[4px]"
                            width="24px"
                            height="24px"
                          />
                          <span className="font-semibold">Loading</span>
                        </div>
                      ) : "Login"}
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
