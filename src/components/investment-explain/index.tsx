import Image from "next/image";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import form from "../../../public/verify-steps/form.svg";
import swapToken from "../../../public/verify-steps/swap-token.svg";
import growthTime from "../../../public/verify-steps/growth-time.svg";
import content from "../../../public/verify-steps/content.svg";

export default function InvestmentExplain() {
  return (
    <div className="flex flex-col gap-[40px] items-center p-0 mlg:px-[20px] md:pt-[40px] xl:px-0 xl:pb-[80px] max-w-[1200px] m-auto">
      <h2 className={`text-[46px] text-text-primary text-center leading-[59px] mb-[20px] ${BOLD_INTER_TIGHT.className}`}>Effortless Property Investment in 3 Steps</h2>
      <div className="grid grid-cols-1 md:grid-cols-[minmax(270px,max-content),minmax(270px,max-content)] mlg:grid-cols-[minmax(270px,max-content),minmax(270px,max-content),minmax(270px,max-content)] w-full justify-between mlg:justify-center mlg:gap-x-[20px] gap-y-[20px]">
        {/* Step 1 */}
        <div className="flex flex-col w-full md:max-w-[270px] h-[354px] items-center justify-between p-[20px] bg-[#61CD81] rounded-[24px] overflow-hidden relative">
          <div className="flex justify-center gap-[7px]">
            <div className="flex justify-center items-center border border-[#fff] w-[21px] h-[21px] rounded-full">
              <span className={`text-[14px] leading-[10px] rounded-full text-[#fff] ${BOLD_INTER_TIGHT.className}`}>1</span>
            </div>
            <span className={`text-[20px] leading-[22px] text-[#fff] ${BOLD_INTER_TIGHT.className}`}>Sign up</span>
          </div>
          <Image src={form} alt="form" className="absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]" />
          <p className="text-[14px] leading-[21px] font-medium text-[#fff]">Sign up on the Landshare Dashboard and complete KYC</p>
        </div>
        
        {/* Step 2 */}
        <div className="flex flex-col w-full md:max-w-[270px] h-[354px] items-center justify-between p-[20px] bg-[#61CD81] rounded-[24px] overflow-hidden relative">
          <div className="flex justify-center gap-[7px]">
            <div className="flex justify-center items-center border border-[#fff] w-[21px] h-[21px] rounded-full">
              <span className={`text-[14px] leading-[10px] rounded-full text-[#fff] ${BOLD_INTER_TIGHT.className}`}>2</span>
            </div>
            <span className={`text-[20px] leading-[22px] text-[#fff] ${BOLD_INTER_TIGHT.className}`}>Purchase Tokens</span>
          </div>
          <Image src={swapToken} alt="swapToken" className="absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]" />
          <p className="text-[14px] leading-[21px] font-medium text-[#fff]">Purchase RWA Tokens with LAND and USDC</p>
        </div>
        
        {/* Step 3 */}
        <div className="flex flex-col w-full md:max-w-[270px] h-[354px] items-center justify-between p-[20px] bg-[#61CD81] rounded-[24px] overflow-hidden relative">
          <div className="flex justify-center gap-[7px]">
            <div className="flex justify-center items-center border border-[#fff] w-[21px] h-[21px] rounded-full">
              <span className={`text-[14px] leading-[10px] rounded-full text-[#fff] ${BOLD_INTER_TIGHT.className}`}>3</span>
            </div>
            <span className={`text-[20px] leading-[22px] text-[#fff] ${BOLD_INTER_TIGHT.className}`}>Hold & Earn</span>
          </div>
          <Image src={growthTime} alt="growthTime" className="absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]" />
          <p className="text-[14px] leading-[21px] font-medium text-[#fff]">Hold your tokens and see them grow over time</p>
        </div>
        
        {/* Step 4 */}
        {/* <div className="flex flex-col w-full md:max-w-[270px] h-[354px] items-center justify-between p-[20px] bg-[#61CD81] rounded-[24px] overflow-hidden relative">
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