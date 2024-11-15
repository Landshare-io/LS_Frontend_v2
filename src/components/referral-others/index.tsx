import { useGlobalContext } from "../../context/GlobalContext";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { IoCopy } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import ReferralCustomizeModal from "../referral-customize";
import { Fuul } from "@fuul/sdk";
import { useAccount } from "wagmi";

export default function ReferralOthers() {
  const { theme } = useGlobalContext();
  const {address} = useAccount();
  const [showCheck, setShowCheck] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState<boolean>(false);
  const [trackingLinkUrl, setTrackingLinkUrl] = useState<string>("");

  useEffect(() => {
    async function fetchTrackingLink() {
      try {
        if(address){
          const link = await Fuul.generateTrackingLink(
            `${process.env.NEXT_PUBLIC_FUUL_API_URL}`,
            address
          );
          
          setTrackingLinkUrl(link);
        }
        
      } catch (error) {
        console.error("Error generating tracking link:", error);
      }
    }

    fetchTrackingLink();
  }, [address]);

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingLinkUrl);
    setShowCheck(true);
    setTimeout(() => setShowCheck(false), 2000);
  };

  const handleOpenModal = () => {
    setShowCustomizeModal(true);
  };

  return (
    <div className="w-full flex flex-col bg-third  rounded-2xl p-6 h-fit gap-4 sm:gap-8 shadow-lg">
      <div className="w-full flex justify-between items-center">
        <p className="font-bold text-lg text-text-primary">Refer Others</p>
        <p
          className="text-sm cursor-pointer text-text-primary"
          onClick={handleOpenModal}
        >
          Customize
        </p>
      </div>

      <ConnectButton.Custom>
        {({ account, chain, authenticationStatus, mounted }) => {
          const ready = mounted && authenticationStatus !== "loading";

          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === "authenticated");

          return (
            <div>
              {(() => {
                if (!connected) {
                  return (
                    <div className="w-full text-center py-3 rounded-xl bg-primary text-[#61CD81] text-base leading-5">
                      Connect your wallet to view link
                    </div>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <div className="w-full text-center py-3 rounded-xl bg-primary text-[#61CD81] text-base leading-5">
                      Wrong network
                    </div>
                  );
                }

                if (!chain.unsupported && connected) {
                  return (
                    <div className="w-full flex justify-between items-center p-2 gap-4 rounded-lg bg-gray-500 bg-opacity-10">
                      <div className=" truncate break-words text-text-primary">
                        {trackingLinkUrl}
                      </div>

                      <div>
                        {showCheck ? (
                          <FaCheck
                            className={`cursor-pointer ${
                              theme === `dark` ? "text-white" : ""
                            }`}
                          />
                        ) : (
                          <IoCopy
                            onClick={handleCopy}
                            className={`cursor-pointer ${
                              theme === `dark` ? "text-white" : ""
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>

      <div className="sm:flex justify-between text-text-primary text-base leading-5">
        <div className="space-y-1">
          <p>LSRWA Incentives</p>
          <p>Fast and deep liquidity</p>
        </div>

        <div className="space-y-1">
          <p>All collateral earns interest</p>
          <p>Unbeatable fees: 0-0.02%</p>
        </div>
      </div>

      <ReferralCustomizeModal
        showModal={showCustomizeModal}
        setShowModal={setShowCustomizeModal}
      />
    </div>
  );
}
