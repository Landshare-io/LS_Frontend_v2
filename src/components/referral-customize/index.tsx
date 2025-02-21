import { useState } from "react";
import ReactModal from "react-modal";
import { IoCloseCircle } from "react-icons/io5";
import { useTheme } from "next-themes";
import { useGlobalContext } from "../../context/GlobalContext";
import { Fuul } from "@fuul/sdk";
import { config } from "../../wagmi";
import { signMessage } from "@wagmi/core";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import { Inter_Tight } from "next/font/google";
import Button from "../common/button";

interface ReferralCustomizeModalProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  setTrackingprettyCode: (trackingprettyCode: string) => void;
  address: string | undefined;
}

const interTight = Inter_Tight({
  style: "normal",
  preload: false,
});

export default function ReferralCustomizeModal({
  showModal,
  setShowModal,
  setTrackingprettyCode,
  address,
}: ReferralCustomizeModalProps) {
  const { notifySuccess, notifyError } = useGlobalContext();
  const { theme } = useTheme();
  const [prettyCode, setPrettyCode] = useState<string>("");

  const customModalStyles = {
    overlay: {
      background: "#00000080",
    },
  };

  const handleEnterCode = async () => {
    try {
      setShowModal(false);
      const codeIsFree = await Fuul.isAffiliateCodeFree(prettyCode);

      if (codeIsFree && prettyCode) {
        const signature = await signMessage(config, {
          message: `I confirm that I am updating my code to ${prettyCode} on Fuul`,
        });

        await Fuul.updateAffiliateCode({
          address: address ?? "",
          code: prettyCode,
          signature: signature,
        });

        setTrackingprettyCode(
          window.location.origin + '/rwa' + "?af=" + prettyCode
        );

        setPrettyCode("");
        notifySuccess(
          "The code is successfully updated and prettyCode is defined"
        );
      } else {
        console.error("The code is not free or prettyCode is not defined");
        notifyError("The code is not free or prettyCode is not defined");
      }
    } catch (error) {
      console.error("Error updating affiliate code:", error);
    }
  };

  return (
    <ReactModal
      isOpen={showModal}
      onRequestClose={() => {
        setShowModal(false);
      }}
      style={customModalStyles}
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden max-w-[450px] w-[90%] h-fit rounded-3xl p-0 border-0 ${interTight.className}`}
    >
      <div className="text-text-primary flex flex-col gap-4 bg-third py-4 px-6">
        <div
          className={`w-full flex justify-between items-center text-xl ${BOLD_INTER_TIGHT.className}`}
        >
          <p>Customize Your Link</p>
          <IoCloseCircle
            className={`size-4 cursor-pointer ${
              theme === `dark` ? "text-white" : ""
            }`}
            onClick={() => {
              setShowModal(false);
            }}
          />
        </div>

        <hr className="bg-secondary h-[1px]" />
        <div>
          <label className="text-text-secondary text-[12px] leading-[22px]">
            Referral Code
          </label>
          <input
            value={prettyCode}
            onChange={(e: any) => setPrettyCode(e.target.value)}
            className="bg-primary dark:bg-secondary text-text-primary py-[13px] px-[20px] w-full rounded-[12px]"
            placeholder="Custom code here..."
          />
        </div>
        <div className="w-full flex justify-center">
          <Button
            className={`w-full h-[44px] text-[#fff] rounded-[100px] bg-[#61cd81]`}
            textClassName="hover:dark:text-[#61CD81] text-[100%]"
            onClick={handleEnterCode}
          >
            Confirm
          </Button>
        </div>
      </div>
    </ReactModal>
  );
}
