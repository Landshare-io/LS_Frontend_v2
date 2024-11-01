import React, { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import numeral from "numeral";
import { BigNumberish, formatEther } from "ethers";
import { useRouter } from "next/router";
import {
  LogoIcon,
  EnergyIcon,
  Lumber,
  Brick,
  Concrete,
  Steel,
  Credit
} from "../icons/nft";
import SwitchTheme from "../switch-theme";
import { useGlobalContext } from "../../../context/GlobalContext";
import useGetResource from "../../../hooks/nft-game/axios/useGetResource";
import useGetNftCredits from "../../../hooks/nft-game/apollo/useGetNftCredits";
import useBalanceOf from "../../../hooks/contract/LandTokenContract/useBalanceOf";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"
import LandshareLogo_Dark from "../../../../public/logo-dark.svg"
import { BOLD_INTER_TIGHT } from "../../../config/constants/environments";

export default function YouOwn(){
  const { theme } = useGlobalContext();
  const [show, setShow] = useState(false)
  const router = useRouter()
  const { address } = useAccount()
  const chainId = useChainId()
  const { data: landTokenBalance } = useBalanceOf({ chainId, address }) as { data: BigNumberish }
  const { resource, maxPowerLimit } = useGetResource()
  const { nftCredits } = useGetNftCredits(address)
  
  return (
    <section className="bottom-[73px] md:bottom-0 bg-[#bce4fa] duration-500 sticky z-[999] opacity-90 shadow-lg py-3 dark:bg-third">
      <div className="flex justify-center">
        <div className="max-w-[1200px] w-[98%] sm:w-[90%] md:w-full">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex justify-between w-full">
              <span
                className={`min-w-[180px] mb-2 inline-block font-semibold ${show ? "text-left" : "text-center"} text-text-secondary pr-10 md:pr-0`}
              >
                You own:
              </span>
              <span className="block md:hidden cursor-pointer" onClick={() => setShow(!show)}>
                {show ? (
                  <MdKeyboardArrowDown className="text-grey-800" />
                ) : (
                  <MdKeyboardArrowUp className="text-grey-800" />
                )}
              </span>
            </div>
            {show && (
              <div className="hidden md:grid grid-cols-[minmax(200px,max-content)] sm:grid-cols-[minmax(200px,max-content),minmax(200px,max-content)] md:grid-cols-[minmax(250px,max-content),minmax(250px,max-content)] lg:grid-cols-[minmax(250px,max-content),minmax(250px,max-content),minmax(250px,max-content)] xl:grid-cols-[minmax(250px,max-content),minmax(250px,max-content),minmax(250px,max-content),minmax(250px,max-content)] w-full overflow-hidden">
                <div className="flex items-center">
                  <div className="w-8 h-8">
                    {theme == 'dark' ? <img src={LandshareLogo_Dark}></img> : <LogoIcon />}
                  </div>
                  <span
                    style={{ minWidth: "133px" }}
                    className={`inline-block pl-2 pr-3 text-[16px] text-text-primary ${BOLD_INTER_TIGHT.className}`}
                  >
                    {numeral(formatEther(landTokenBalance)).format("0.[00]").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    <span className="text-[14px] text-text-primary"> LAND</span>
                  </span>
                  <span
                    className="cursor-pointer hidden hover:shadow-md sm:block text-[#bce4fa] font-normal w-[20px] h-[20px] text-center rounded-full text-[18px] bg-[#000000ba] duration-300 dark:bg-primary dark:text-text-primary"
                    onClick={() => router.push("/nft/resources")}
                  >
                    +
                  </span>
                </div>
                <div className="flex items-center">
                  <Lumber />
                  <span className={`inline-block pl-2 pr-3 text-[16px] text-text-primary ${BOLD_INTER_TIGHT.className}}`}>
                    {numeral(resource[1]).format("0.[00]")}
                    <span className="text-[14px] text-text-primary"> Lumber</span>
                  </span>
                </div>
                <div className="flex items-center">
                  <Concrete />
                  <span className={`inline-block pl-2 pr-3 text-[16px] text-text-primary ${BOLD_INTER_TIGHT.className}`}>
                    {numeral(resource[3]).format("0.[00]")}
                    <span className="text-[14px] text-text-primary"> Concrete</span>
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="">
                    <Steel />
                  </span>
                  <span className={`inline-block pl-2 pr-3 text-[16px] text-text-primary ${BOLD_INTER_TIGHT.className}`}>
                    {numeral(resource[4]).format("0.[00]")}
                    <span className="fs-xs text-text-primary"> Steel</span>
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="">
                    <EnergyIcon />
                  </span>
                  <span
                    style={{ minWidth: "133px" }}
                    className={`inline-block pl-2 pr-3 text-[16px] text-text-primary ${BOLD_INTER_TIGHT.className}`}
                  >
                    {numeral(resource[0]).format("0.[00]")} / {maxPowerLimit}
                    <span className="fs-xs text-text-primary"> Power</span>
                  </span>
                  <span
                    className="cursor-pointer hidden hover:shadow-md sm:block text-[#bce4fa] font-normal w-[20px] h-[20px] text-center rounded-full text-[18px] bg-[#000000ba] duration-300 dark:bg-primary dark:text-text-primary"
                    onClick={() => router.push("/nft/resources")}
                  >
                    +
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="">
                    <Brick />
                  </span>
                  <span className={`inline-block pl-2 pr-3 text-[16px] text-text-primary ${BOLD_INTER_TIGHT.className}`}>
                    {numeral(resource[2]).format("0.[00]")}
                    <span className="fs-xs text-text-primary"> Brick</span>
                  </span>
                </div>
                <div className="flex items-center">
                  <Credit />
                  <span className={`inline-block pl-2 pr-3 text-[16px] text-text-primary ${BOLD_INTER_TIGHT.className}`}>
                  {numeral(Number(nftCredits)).format("0.[00]")}
                    <span className="fs-xs text-text-primary"> Credits</span>
                  </span>
                </div>
               <SwitchTheme /> 
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
