import { useGlobalContext } from "../../context/GlobalContext";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { IoCopy } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import ReferralCustomizeModal from "../referral-customize";
import { Fuul } from "@fuul/sdk";
import { useAccount } from "wagmi";
import { signMessage } from "@wagmi/core";
import { config } from "../../wagmi";
import Button from "../common/button";

export default function ReferralOthers() {
  const { theme } = useGlobalContext();
  const { address } = useAccount();
  const [showCheck, setShowCheck] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState<boolean>(false);
  const [trackingLinkUrl, setTrackingLinkUrl] = useState<string>("");

  const handleGenerateCode = async () => {
    try {
      if (address) {
        const affiliateCode = await Fuul.getAffiliateCode(address);

        if (!affiliateCode) {
          const signature = await signMessage(config, {
            message: `I confirm that I am creating the ${address} code on Fuul`,
          });

          await Fuul.createAffiliateCode({
            address: address ?? "",
            code: address ?? "",
            signature: signature,
          });
        }

        const code = await Fuul.getAffiliateCode(address);

        const link = await Fuul.generateTrackingLink(
          `${process.env.NEXT_PUBLIC_FUUL_API_URL}`,
          code ?? ""
        );

        setTrackingLinkUrl(link);
      }
    } catch (error) {
      console.error("Error generating tracking link:", error);
    }
  };

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
        {address && trackingLinkUrl ? (
          <p
            className="text-sm cursor-pointer text-text-primary"
            onClick={handleOpenModal}
          >
            Customize
          </p>
        ) : (
          <Button
            className={`w-fit h-[44px] px-8 text-[#fff] rounded-[100px] bg-[#61cd81]`}
            textClassName="hover:dark:text-[#61CD81] text-[100%]"
            onClick={handleGenerateCode}
          >
            Generate
          </Button>
        )}
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
                      Connect your wallet to get your personalized invite link!
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
                    <div className="w-full flex justify-between items-center p-2 gap-4 rounded-lg bg-gray-400 bg-opacity-10">
                      {trackingLinkUrl ? (
                        <div className="truncate break-words text-text-primary px-2">
                          {trackingLinkUrl}
                        </div>
                      ) : (
                        <div className="truncate break-words text-primary-green px-2">
                          Your referral link will appear here...
                        </div>
                      )}

                      <div>
                        {showCheck ? (
                          <FaCheck
                            className={`cursor-pointer text-primary-green transition-opacity`}
                          />
                        ) : (
                          <IoCopy
                            onClick={handleCopy}
                            className={`cursor-pointer text-primary-green transition-opacity`}
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

      <ReferralCustomizeModal
        showModal={showCustomizeModal}
        setShowModal={setShowCustomizeModal}
        setTrackingprettyCode={setTrackingLinkUrl}
        address={address}
      />
    </div>
  );
}
