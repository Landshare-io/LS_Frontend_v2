import react from "react";
import StepCard from "../effortless-steps";
import completeKyc from "../../../public/img/rwa-steps/completeKyc.png";
import depositStableCoins from "../../../public/img/rwa-steps/depositStableCoins.png";
import holdAndEarn from "../../../public/img/rwa-steps/hold&earn.png";
import mobileHoldAndEarn from "../../../public/img/rwa-steps/hold&earn-mobile.png";
import principle from "../../../public/img/rwa-steps/principle.png";
import principleMobile from "../../../public/img/rwa-steps/principle-mobile.png";
import { useAccount, useChainId } from "wagmi";
import useIsWhitelistedAddress from "../../hooks/contract/RWAContract/useIsWhitelistedAddress";
import {
  BOLD_INTER_TIGHT,
  MAJOR_WORK_CHAINS,
} from "../../config/constants/environments";
import { useEffect, useState } from "react";
import { Styles } from "react-modal";
import { MdCancel } from "react-icons/md";
import Button from "../common/button";
import Modal from "react-modal";
import KYCWidget from "../sumsub-widget";
import { bsc } from "viem/chains";

const RWA_MAJOR_CHAINS = MAJOR_WORK_CHAINS["/rwa"];
function EffortlessStepsSection() {
  const [iskycmodal, setKycopen] = useState(false);
  const [isZeroIDModal, setZeroIDModalOpen] = useState(false);

  const chainId = useChainId();
  const { address } = useAccount();
  const { data: isWhitelisted, refetch } = useIsWhitelistedAddress(
    (RWA_MAJOR_CHAINS.map((chain) => chain.id) as number[]).includes(chainId)
      ? chainId
      : 56,
    address
  );

  useEffect(() => {
    (async () => {
      await refetch();
    })();
  }, [isZeroIDModal]);

  const customModalStyles: Styles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflowY: "auto",
      overflowX: "hidden",
      maxWidth: "400px",
      width: "90%",
      maxHeight: "90vh",
      borderRadius: "20px",
    },
    overlay: {
      zIndex: 99999,
      background: "#00000080",
    },
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  async function handlemodalkyc() {
    setKycopen(true);
    document.body.style.overflow = "hidden";
  }
  function handleclosemodal() {
    setKycopen(false);
    document.body.style.overflow = "auto";
  }

  const handleLinkClick = (event: any) => {
    event.preventDefault(); // Prevent the default link behavior
    setKycopen(false);
    setZeroIDModalOpen(true);
    document.body.style.overflow = "hidden";
  };
  return (
    <div className="pt-[160px] pb-[128px] lg:px-[120px] px-[10px] md:px-[40px] flex flex-col justify-center items-center gap-8">
      <Modal
        isOpen={iskycmodal}
        onRequestClose={() => {
          setKycopen(false), document.body.classList.remove("modal-open");
        }}
        style={customModalStyles}
        contentLabel="Modal"
      >
        <MdCancel
          onClick={handleclosemodal}
          className="float-right text-[#000] cursor-pointer absolute right-[20px] top-[15px] hover:text-gray"
        />
        <div className="w-full">
          <h5
            className={`text-[1.5rem] leading-[1.334] text-center ${BOLD_INTER_TIGHT.className}`}
          >
            KYC Verification
          </h5>
          <p
            className={`text-[16px] pt-[10px] leading-[28px] text-center tracking-[2%] ${BOLD_INTER_TIGHT.className} !font-normal`}
          >
            Complete the KYC process to access RWA Tokens
          </p>
        </div>
        <div className="w-full mt-3">
          <a href="https://dashboard.landshare.io">
            <Button
              className="flex flex-col justify-center items-center w-full pb-[10px] bg-primary-green text-[#fff] rounded-[20px] pt-[10px] border-b relative hover:bg-green-600 transition-colors"
              disabled={chainId != bsc.id}
            >
              <p
                className={`text-[16px] leading-[28px] tracking-[2%] ${BOLD_INTER_TIGHT.className}`}
              >
                Manual Verification
              </p>
            </Button>
            <p className="text-xs text-text-secondary text-center mt-1">
              Recommended for advanced users and large investors
            </p>
          </a>
          <div onClick={handleLinkClick}>
            <Button
              className="flex flex-col disabled:bg-[#c2c5c3] justify-center items-center w-full pb-[10px] bg-primary-green text-[#fff] rounded-[20px] pt-[10px] border-b relative hover:bg-green-600 transition-colors mt-4"
              disabled
            >
              <p
                className={`text-[16px] leading-[28px] tracking-[2%] ${BOLD_INTER_TIGHT.className}`}
              >
                Sumsub Verification
              </p>
            </Button>
            <p className="text-xs text-text-secondary text-center mt-1">
              Quick verification - 5 minutes or less!
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isZeroIDModal}
        onRequestClose={() => {
          setZeroIDModalOpen(true),
            document.body.classList.remove("modal-open");
        }}
        style={customModalStyles}
        contentLabel="Sumsub Modal"
        className="relative"
      >
        <MdCancel
          onClick={() => {
            setZeroIDModalOpen(false);
            document.body.style.overflow = "auto";
          }}
          className="float-right text-[#000] cursor-pointer absolute right-[20px] top-[15px] hover:text-gray"
        />
        <KYCWidget />
      </Modal>
      <div className="flex flex-col gap-[10px] items-start lg:items-center">
        <h2
          id="target-element"
          className={` text-text-primary text-center text-balance text-[32px]  md:leading-normal md:text-[40px] lg:text-[56px] font-bold`}
        >
          Effortless Property Investment in 4 Steps{" "}
        </h2>
        <p className="text-text-secondary text-sm text-center  max-w-[719px] ">
          Unlock the world of property investment with ease through Landshare
          and RWA tokens. Our simple, 4-step process lets you invest in real
          estate without the complexities of traditional methods.
        </p>
      </div>
      <div className="grid lg:grid-cols-4 justify-start gap-4 ">
        <StepCard
          step="Step One"
          title="Complete KYC"
          image={completeKyc}
          buttonLabel={isWhitelisted ? "Complete" : "Verify now"}
          buttonAction={handlemodalkyc}
          isDisabled={isWhitelisted as boolean}
          showArrow
        />

        <StepCard
          step="Step Two"
          title="Deposit Stablecoins"
          image={depositStableCoins}
          buttonLabel="View details"
          buttonAction={scrollToTop}
          showArrow
        />
        <div className="hidden lg:block">
          <StepCard
            step="Step Three"
            title="Hold & Earn"
            image={holdAndEarn}
            buttonLabel="Learn more"
            buttonHref="https://docs.landshare.io/platform-features/landshare-rwa-token-lsrwa/rwa-token-utilities"
            showArrow
            arrowZIndex="z-[100]"
          />
        </div>
        <div className="block lg:hidden">
          <StepCard
            step="Step Three"
            title="Hold & Earn"
            image={mobileHoldAndEarn}
            buttonLabel="Learn more"
            buttonHref="https://docs.landshare.io/platform-features/landshare-rwa-token-lsrwa/rwa-token-utilities"
            showArrow
            arrowZIndex="z-[100]"
          />
        </div>
        <div className="hidden lg:block">
          <StepCard
            step="Step Four"
            title="Withdraw Principal"
            image={principle}
            buttonLabel="Learn more"
            buttonHref="https://docs.landshare.io/platform-features/landshare-rwa-token-lsrwa/rwa-token-utilities"
          />
        </div>
        <div className="block lg:hidden">
          <StepCard
            step="Step Four"
            title="Withdraw Principal"
            image={principleMobile}
            buttonLabel="Learn more"
            buttonHref="https://docs.landshare.io/platform-features/landshare-rwa-token-lsrwa/rwa-token-utilities"
          />
        </div>
      </div>
    </div>
  );
}

export default EffortlessStepsSection;
