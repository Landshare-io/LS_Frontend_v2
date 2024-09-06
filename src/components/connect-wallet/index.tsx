import React from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Button from "../common/button";

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
            <div className={`flex justify-end ${containerClassName}`}>
              {(() => {
                if (!connected) {
                  return (
                    <Button
                      className={`text-[#fff] px-[24px] py-[13px] rounded-[100px] ${connectButtonClassName}`}
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
                      className="dark:text-[#3c3c3c] transition ease-in-out delay-400"
                    >
                      Wrong network
                    </Button>
                  );
                }

                // if (!isAuthenticated && pathname.includes('/nft') && chain.id == 56) {
                //   return (
                //     <button onClick={() => checkIsAuthenticated()} type="button-container" className="nav-btn bg-[#61CD81] text-button-text-secondary">
                //       Login
                //     </button>
                //   );
                // } else {
                //   return (
                //     // <button
                //     //   onClick={openAccountModal}
                //     //   type="button-container"
                //     //   className="nav-btn dark:text-[#3c3c3c]"
                //     // >
                //     //   {account.displayName}
                //     // </button>
                //     <div className="flex items-center">
                //       <button
                //         onClick={openChainModal}
                //         type="button"
                //         className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors duration-200 mr-2"
                //       >
                //         <img
                //           src={chain.iconUrl}
                //           alt={chain.name}
                //           className="w-6 h-6"
                //         />
                //       </button>
                //       <button
                //         onClick={openAccountModal}
                //         type="button-container"
                //         className="nav-btn dark:text-[#3c3c3c]"
                //       >
                //         {account.displayName}
                //       </button>
                //     </div>
                //   );
                // }
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </>
  );
}
