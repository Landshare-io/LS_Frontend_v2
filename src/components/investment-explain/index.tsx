import { useState, useEffect } from "react";
import Image from "next/image";
import Modal from "react-modal";
import { useAccount, useChainId } from "wagmi";
import { MdCancel } from "react-icons/md";
import { bsc } from "viem/chains";
import { useTheme } from "next-themes";
import useIsWhitelisted from "../../hooks/contract/WhitelistContract/useIsWhitelisted";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import Button from "../common/button";
import { MAJOR_WORK_CHAINS } from "../../config/constants/environments";
import ZeroIDWidget from "../zero-id-widget";
import KYCWidget from "../sumsub-widget";
import form from "../../../public/verify-steps/form.svg";
import swapToken from "../../../public/verify-steps/swap-token.svg";
import growthTime from "../../../public/verify-steps/growth-time.svg";
import arrowLeft from "../../../public/icons/arrow-left.svg";
import type { Styles } from "react-modal";

const RWA_MAJOR_CHAINS = MAJOR_WORK_CHAINS["/rwa"];

export default function InvestmentExplain() {
  const { theme } = useTheme();
  const chainId = useChainId();
  const {address} = useAccount();
  const { data: isWhitelisted, refetch } = useIsWhitelisted((RWA_MAJOR_CHAINS.map(chain => chain.id) as number[]).includes(chainId) ? chainId : 56, address);
  const [iskycmodal, setKycopen] = useState(false);
  const [isZeroIDModal, setZeroIDModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      await refetch();
    })()
  }, [isZeroIDModal])

  const customModalStyles: Styles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflowY: "auto",
      overflowX: "auto",
      maxWidth: "400px",
      width: "90%",
      maxHeight: "90vh",
      borderRadius: "20px",
      border: 0,
      backgroundColor: theme == "dark" ? "#31333b" : "#f6f7f9",
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
  }
  function handleclosemodal() {
    setKycopen(false);
  }

  const handleLinkClick = (event: any) => {
    event.preventDefault(); // Prevent the default link behavior
    setKycopen(false);
    setZeroIDModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-[40px] items-center p-0 mlg:px-[20px] xl:px-0 xl:pb-[80px] max-w-[1200px] m-auto">
      <div className="flex flex-col gap-[10px] items-start lg:items-center">
        <h2
          id="target-element"
          className={` text-text-primary lg:text-center text-[32px] leading-[36px] md:leading-normal md:text-[40px] lg:text-[56px] font-bold`}
        >
          Effortless Property Investment in 3 Steps
        </h2>
        <p className="text-text-secondary text-sm lg:text-center  max-w-[719px] ">
          Unlock the world of property investment with ease through Landshare
          and RWA tokens. Our simple, 3-step process lets you invest in real
          estate without the complexities of traditional methods.
        </p>
      </div>
      <div className="flex flex-col items-center mlg:flex-row w-full gap-[10px]">
        {/* Step 1 */}
        <div className="flex flex-col shrink-0 grow-0 w-full md:w-[270px] h-[354px] items-center justify-between p-[20px] bg-gradient-to-b from-[#61CD81] to-[#2B9F49] rounded-[24px] overflow-hidden relative">
          <div className="flex justify-center gap-[7px]">
            <div className="flex justify-center items-center border border-[#fff] w-[21px] h-[21px] rounded-full">
              <span
                className={`text-[14px] leading-[10px] rounded-full text-[#fff] ${BOLD_INTER_TIGHT.className}`}
              >
                1
              </span>
            </div>
            <span
              className={`text-[20px] leading-[22px] text-[#fff] ${BOLD_INTER_TIGHT.className}`}
            >
              Sign up
            </span>
          </div>

          <Image
            src={form}
            alt="form"
            className="absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]"
          />
          <button
            disabled={isWhitelisted as boolean}
            className={`w-full rounded-[100px] py-[10px] text-[16px] leading-[24px] font-bold ${isWhitelisted ? "cursor-not-allowed bg-[#d9dce7] text-[#fff]" : "cursor-pointer !text-[#000] hover:bg-slate-200 transition-all hover:-translate-y-1 bg-[#fff]"}`}
            onClick={() => handlemodalkyc()}
          >
            {isWhitelisted ? "Complete" : "Verify now"}
          </button>
        </div>

        <div className="flex items-center justify-center w-full h-[100px] mlg:h-full">
          <Image
            src={arrowLeft}
            alt="arrow-left"
            className="rotate-90 w-fit mlg:rotate-0 mlg:w-full h-[10px] text-[#2A8442]"
          />
        </div>

        {/* Step 2 */}
        <div className="flex flex-col shrink-0 grow-0 w-full md:w-[270px] h-[354px] items-center justify-between p-[20px] bg-gradient-to-b from-[#61CD81] to-[#2B9F49] rounded-[24px] overflow-hidden relative">
          <div className="flex justify-center gap-[7px]">
            <div className="flex justify-center items-center border border-[#fff] w-[21px] h-[21px] rounded-full">
              <span
                className={`text-[14px] leading-[10px] rounded-full text-[#fff] ${BOLD_INTER_TIGHT.className}`}
              >
                2
              </span>
            </div>
            <span
              className={`text-[20px] leading-[22px] text-[#fff] ${BOLD_INTER_TIGHT.className}`}
            >
              Purchase Tokens
            </span>
          </div>
          <Image
            src={swapToken}
            alt="swapToken"
            className="absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]"
          />
          <button
            onClick={() => scrollToTop()}
            className="!bg-[#fff] text-[#000] hover:bg-slate-200 transition-all hover:-translate-y-1 w-full rounded-[100px] py-[10px] text-[16px]  leading-[24px] font-bold"
          >
            View details
          </button>
        </div>

        <div className="flex items-center justify-center w-full h-[100px] mlg:h-full">
          <Image
            src={arrowLeft}
            alt="arrow-left"
            className="rotate-90 w-fit mlg:rotate-0 mlg:w-full h-[10px] text-[#2A8442]"
          />
        </div>

        {/* Step 3 */}
        <div className="flex flex-col shrink-0 grow-0 w-full md:w-[270px] h-[354px] items-center justify-between p-[20px] bg-gradient-to-b from-[#61CD81] to-[#2B9F49] rounded-[24px] overflow-hidden relative">
          <div className="flex justify-center gap-[7px]">
            <div className="flex justify-center items-center border border-[#fff] w-[21px] h-[21px] rounded-full">
              <span
                className={`text-[14px] leading-[10px] rounded-full text-[#fff] ${BOLD_INTER_TIGHT.className}`}
              >
                3
              </span>
            </div>
            <span
              className={`text-[20px] leading-[22px] text-[#fff] ${BOLD_INTER_TIGHT.className}`}
            >
              Hold & Earn
            </span>
          </div>
          <Image
            src={growthTime}
            alt="growthTime"
            className="absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]"
          />
          <a
            className="w-full !text-[#000]"
            href=" https://docs.landshare.io/platform-features/landshare-rwa-token-lsrwa/rwa-token-utilities"
          >
            <button className="!bg-[#fff] hover:bg-slate-200 transition-all hover:-translate-y-1 w-full rounded-[100px] py-[10px] text-[16px]  leading-[24px] font-bold">
              Learn more
            </button>
          </a>
        </div>

        {/* Step 4 */}
        {/* <div className="flex flex-col w-full md:max-w-[270px] h-[354px] items-center justify-between p-[20px] bg-gradient-to-b from-[#61CD81] to-[#2B9F49] rounded-[24px] overflow-hidden relative">
          <div className="flex justify-center gap-[7px]">
            <div className="flex justify-center items-center border border-[#fff] w-[21px] h-[21px] rounded-full">
              <span className={`text-[14px] leading-[10px] rounded-full text-[#fff] ${BOLD_INTER_TIGHT.className}`}>4</span>
            </div>
            <span className={`text-[20px] leading-[22px] text-[#fff] ${BOLD_INTER_TIGHT.className}`}>Buy Landshare NFTs</span>
          </div>
          <Image src={content} alt="content" className="absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]" />
          <p className="text-[14px] leading-[21px] font-medium text-[#fff]">Enhance your investment with Landshare NFTs</p>
        </div> */}
      </div>
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
          className="float-right text-[#000] dark:text-[#fff] cursor-pointer absolute right-[20px] top-[15px] hover:text-gray"
        />
        <div className="w-full">
          <h5
            className={`text-center text-[1.5rem] leading-[1.334] text-center ${BOLD_INTER_TIGHT.className}`}
          >
            KYC Verification
          </h5>
          <p
            className={`text-[#000000CC] dark:text-[#fff] text-[16px] pt-[10px] leading-[28px] text-center tracking-[2%] ${BOLD_INTER_TIGHT.className} !font-normal`}
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
            <p className="text-xs text-text-secondary text-center mt-1">Recommended for advanced users and large investors</p>
          </a>
          <div onClick={handleLinkClick}>
            <Button
              className="flex flex-col disabled:bg-[#c2c5c3] justify-center items-center w-full pb-[10px] bg-primary-green text-[#fff] rounded-[20px] pt-[10px] border-b relative hover:bg-green-600 transition-colors mt-4"
          
            >
              <p
                className={`text-[16px] leading-[28px] tracking-[2%] ${BOLD_INTER_TIGHT.className}`}
              >
                Sumsub Verification
              </p>
            </Button>
            <p className="text-xs text-text-secondary text-center mt-1">Quick verification - 5 minutes or less!</p>
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
          }}
          className="float-right text-[#000] dark:text-[#fff] cursor-pointer absolute right-[20px] top-[15px] hover:text-gray"
        />
        <KYCWidget />
      </Modal>
    </div>
  );
}
