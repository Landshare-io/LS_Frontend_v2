import Image from "next/image";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import form from "../../../public/verify-steps/form.svg";
import swapToken from "../../../public/verify-steps/swap-token.svg";
import growthTime from "../../../public/verify-steps/growth-time.svg";
import content from "../../../public/verify-steps/content.svg";
import arrowLeft from "../../../public/icons/arrow-left.svg";

export default function InvestmentExplain() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="flex flex-col gap-[40px] items-center p-0 mlg:px-[20px] md:pt-[40px] xl:px-0 xl:pb-[80px] max-w-[1200px] m-auto">
      <div className="flex flex-col gap-[10px] mb-[20px] items-center">
        <h2
          id="target-element"
          className={`text-[46px] text-tw-text-primary text-center leading-[59px] font-bold`}
        >
          Effortless Property Investment in 3 Steps
        </h2>
        <p className="text-[14px] leading-[17px] max-w-[719px] text-center">
          Unlock the world of property investment with ease through Landshare and RWA tokens. Our simple, 3-step process lets you invest in real estate without the complexities of traditional methods.
        </p>
      </div>
      <div className="flex flex-col items-center mlg:flex-row w-full gap-[10px]">
        {/* Step 1 */}
        <div className="flex flex-col shrink-0 grow-0 w-full md:w-[270px] h-[354px] items-center justify-between p-[20px] bg-gradient-to-b from-[#61CD81] to-[#2B9F49] rounded-[24px] overflow-hidden relative">
          <div className="flex justify-center gap-[7px]">
            <div className="flex justify-center items-center border border-[#fff] w-[21px] h-[21px] rounded-full">
              <span className={`text-[14px] leading-[10px] rounded-full text-[#fff] ${BOLD_INTER_TIGHT.className}`}>1</span>
            </div>
            <span className={`text-[20px] leading-[22px] text-[#fff] ${BOLD_INTER_TIGHT.className}`}>Sign up</span>
          </div>
          <Image src={form} alt="form" className="absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]" />
          <a
            className="!text-[#000] w-full"
            href="https://dashboard.landshare.io/"
          >
            <button className="!bg-[#fff] hover:bg-slate-200 transition-all hover:-translate-y-1 w-full rounded-[100px] py-[10px] text-[16px]  leading-[24px] font-bold">
              Verify now
            </button>
          </a>
        </div>

        <div className="flex items-center justify-center w-full h-[100px] mlg:h-full">
          <Image src={arrowLeft} alt="arrow-left" className="rotate-90 w-fit mlg:rotate-0 mlg:w-full h-[10px] text-[#2A8442]" />
        </div>
        
        {/* Step 2 */}
        <div className="flex flex-col shrink-0 grow-0 w-full md:w-[270px] h-[354px] items-center justify-between p-[20px] bg-gradient-to-b from-[#61CD81] to-[#2B9F49] rounded-[24px] overflow-hidden relative">
          <div className="flex justify-center gap-[7px]">
            <div className="flex justify-center items-center border border-[#fff] w-[21px] h-[21px] rounded-full">
              <span className={`text-[14px] leading-[10px] rounded-full text-[#fff] ${BOLD_INTER_TIGHT.className}`}>2</span>
            </div>
            <span className={`text-[20px] leading-[22px] text-[#fff] ${BOLD_INTER_TIGHT.className}`}>Purchase Tokens</span>
          </div>
          <Image src={swapToken} alt="swapToken" className="absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]" />
          <button
            onClick={() => scrollToTop()}
            className="!bg-[#fff] hover:bg-slate-200 transition-all hover:-translate-y-1 w-full rounded-[100px] py-[10px] text-[16px]  leading-[24px] font-bold"
          >
            View details
          </button>
        </div>

        <div className="flex items-center justify-center w-full h-[100px] mlg:h-full">
          <Image src={arrowLeft} alt="arrow-left" className="rotate-90 w-fit mlg:rotate-0 mlg:w-full h-[10px] text-[#2A8442]" />
        </div>
        
        {/* Step 3 */}
        <div className="flex flex-col shrink-0 grow-0 w-full md:w-[270px] h-[354px] items-center justify-between p-[20px] bg-gradient-to-b from-[#61CD81] to-[#2B9F49] rounded-[24px] overflow-hidden relative">
          <div className="flex justify-center gap-[7px]">
            <div className="flex justify-center items-center border border-[#fff] w-[21px] h-[21px] rounded-full">
              <span className={`text-[14px] leading-[10px] rounded-full text-[#fff] ${BOLD_INTER_TIGHT.className}`}>3</span>
            </div>
            <span className={`text-[20px] leading-[22px] text-[#fff] ${BOLD_INTER_TIGHT.className}`}>Hold & Earn</span>
          </div>
          <Image src={growthTime} alt="growthTime" className="absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]" />
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
    </div>
  )
}