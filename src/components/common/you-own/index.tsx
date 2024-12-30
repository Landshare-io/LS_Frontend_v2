import React, { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import numeral from "numeral";
import { BigNumberish, formatEther } from "ethers";
import { useRouter } from "next/router";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
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
import useGetResource from "../../../hooks/nft-game/axios/useGetResource";
import useGetNftCredits from "../../../hooks/nft-game/apollo/useGetNftCredits";
import useBalanceOf from "../../../hooks/contract/LandTokenContract/useBalanceOf";

export default function YouOwn(){
  const [show, setShow] = useState(false)
  const router = useRouter()
  const { address } = useAccount()
  const chainId = useChainId()
  const { data: landTokenBalance } = useBalanceOf({ chainId, address }) as { data: BigNumberish }
  const { resource, maxPowerLimit } = useGetResource()
  const { nftCredits } = useGetNftCredits(address)
  const [openDrawer, setOpenDrawer]= useState(false)

  
  return (
      <section 
        className="bottom-[73px] mlg:bottom-0 bg-secondary duration-500 sticky z-[9] border-t-green-500 border-[1px] py-3 dark:bg-third ">
          <div className="flex justify-center">
            <div className="max-w-[1200px] w-[98%] sm:w-[90%] md:w-full">
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex justify-between mb-2">
                  <span
                    className={`min-w-[120px] inline-block font-semibold ${show ? "text-left" : "text-center"} text-text-primary pr-10 md:pr-0`}
                    >
                    You own
                  </span>
                  <span className="flex items-center mlg:hidden cursor-pointer" onClick={() => { setShow(!show); setOpenDrawer(!openDrawer)}}>

                    {show ? (
                      <MdKeyboardArrowDown className="text-grey-800" />
                    ) : (
                      <MdKeyboardArrowUp className="text-grey-800" />
                    )}
                  </span>
                </div>
                <div className="hidden mlg:grid mlg:grid-cols-4 items-center gap-3 w-full px-3">
                  <div className="flex items-center max-w-[170px] relative">
                    <div className="size-[48px] flex items-center">
                      {<LogoIcon />}
                    </div>
                    <span
                      className={`font-bold flex flex-col pl-2 pr-3 text-[16px] text-text-primary`}
                    >
                      {numeral(formatEther(landTokenBalance)).format("0.[00]").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      <span className="text-[14px] text-text-primary font-medium"> LAND</span>
                    </span>
                    <span
                      className="absolute right-0 cursor-pointer hover:shadow-md text-[#61CD81] font-medium w-[20px] h-[20px] leading-[20px] text-center rounded-full text-[16px] border-[1px] border-[#61CD81] flex items-center justify-center duration-300 dark:bg-primary dark:text-text-primary"
                      onClick={() => router.push("/nft/resources")}
                    >
                      +
                    </span>
                  </div>
                  <div className="flex items-center max-w-[170px]">
                    <div className="size-[48px] flex items-center justify-center dark:bg-[#66a6e3]/20 bg-[#1D4264]/15 border-[1px] border-[#1D4264]/40 rounded-full">
                      <Lumber fill="#1D4264" darkFill="#66a6e3" height="24" width="24"/>
                    </div>
                    <span className={`flex flex-col font-bold  pl-2 pr-3 text-[16px] text-text-primary dark}`}>
                      {numeral(resource[1]).format("0.[00]")}
                      <span className="text-[14px] text-text-primary font-medium"> Lumber</span>
                    </span>
                  </div>
                  <div className="flex items-center max-w-[170px]">
                    <div className="size-[48px] flex items-center justify-center bg-[#24BC48]/15 border-[1px] border-[#24BC48]/40 rounded-full">
                      <Concrete fill="#24BC48"  height="24" width="24"/>
                    </div>
                    <span className={`flex flex-col font-bold  pl-2 pr-3 text-[16px] text-text-primary`}>
                      {numeral(resource[3]).format("0.[00]")}
                      <span className="text-[14px] text-text-primary font-medium"> Concrete</span>
                    </span>
                  </div>
                  <div className="flex items-center max-w-[170px]">
                    <div className="size-[48px] flex items-center justify-center bg-[#A0B71B]/15 border-[1px] border-[#A0B71B]/40 rounded-full">
                      <Steel fill="#A0B71B"  height="24" width="24"/>
                    </div>
                    <span className={`flex flex-col font-bold  pl-2 pr-3 text-[16px] text-text-primary`}>
                      {numeral(resource[4]).format("0.[00]")}
                      <span className="fs-xs text-text-primary font-medium"> Steel</span>
                    </span>
                  </div>
                  <div className="relative flex items-center max-w-[170px]">
                    <div className="size-[48px] flex items-center justify-center bg-[#CE8B11]/15 border-[1px] border-[#CE8B11]/40 rounded-full">
                      <EnergyIcon fill="#CE8B11"  height="24" width="24"/>
                    </div>
                    <span
                      className={`font-bold flex flex-col pl-2 pr-3 text-[16px] text-text-primary`}
                    >
                      {numeral(resource[0]).format("0.[00]")} / {maxPowerLimit}
                      <span className="fs-xs text-text-primary font-medium"> Power</span>
                    </span>
                    <span
                      className="absolute right-0 cursor-pointer hover:shadow-md text-[#61CD81] font-medium w-[20px] h-[20px] leading-[20px] text-center rounded-full text-[16px] border-[1px] border-[#61CD81] flex items-center justify-center duration-300 dark:bg-primary dark:text-text-primary"
                      onClick={() => router.push("/nft/resources")}
                    >
                      +
                    </span>
                  </div>
                  <div className="flex items-center max-w-[170px]">
                    <div className="size-[48px] flex items-center justify-center bg-[#AD61CD]/15 border-[1px] border-[#AD61CD]/40 rounded-full">
                      <Brick fill="#AD61CD"  height="24" width="24"/>
                    </div>
                    <span className={`flex flex-col font-bold  pl-2 pr-3 text-[16px] text-text-primary`}>
                      {numeral(resource[2]).format("0.[00]")}
                      <span className="fs-xs text-text-primary font-medium"> Brick</span>
                    </span>
                  </div>
                  <div className="flex items-center max-w-[170px]">
                  <div className="size-[48px] flex items-center justify-center bg-[#33AFB7]/15 border-[1px] border-[#33AFB7]/40 rounded-full">
                    <Credit fill="#33AFB7"  height="24" width="24"/>
                  </div>
                    <span className={`flex flex-col font-bold  pl-2 pr-3 text-[16px] text-text-primary`}>
                    {numeral(Number(nftCredits)).format("0.[00]")}
                      <span className="fs-xs text-text-primary font-medium"> Credits</span>
                    </span>
                  </div>
                  <div className="w-[150px]">
                    <SwitchTheme className="!m-0" />
                  </div>
                </div>
                {show && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 mlg:hidden items-center gap-3 w-full px-3">
                    <div className="flex items-center max-w-[170px] relative">
                      <div className="size-[48px] flex items-center">
                        {<LogoIcon />}
                      </div>
                      <span
                        className={`font-bold flex flex-col pl-2 pr-3 text-[16px] text-text-primary`}
                      >
                        {numeral(formatEther(landTokenBalance)).format("0.[00]").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        <span className="text-[14px] text-text-primary font-medium"> LAND</span>
                      </span>
                      <span
                        className="absolute right-0 cursor-pointer hover:shadow-md text-[#61CD81] font-medium w-[20px] h-[20px] leading-[20px] text-center rounded-full text-[16px] border-[1px] border-[#61CD81] flex items-center justify-center duration-300 dark:bg-primary dark:text-text-primary"
                        onClick={() => router.push("/nft/resources")}
                      >
                        +
                      </span>
                    </div>
                    <div className="flex items-center max-w-[170px]">
                      <div className="size-[48px] flex items-center justify-center dark:bg-[#66a6e3]/20 bg-[#1D4264]/15 border-[1px] border-[#1D4264]/40 rounded-full">
                        <Lumber fill="#1D4264" darkFill="#66a6e3" height="24" width="24"/>
                      </div>
                      <span className={`flex flex-col font-bold  pl-2 pr-3 text-[16px] text-text-primary dark}`}>
                        {numeral(resource[1]).format("0.[00]")}
                        <span className="text-[14px] text-text-primary font-medium"> Lumber</span>
                      </span>
                    </div>
                    <div className="flex items-center max-w-[170px]">
                      <div className="size-[48px] flex items-center justify-center bg-[#24BC48]/15 border-[1px] border-[#24BC48]/40 rounded-full">
                        <Concrete fill="#24BC48"  height="24" width="24"/>
                      </div>
                      <span className={`flex flex-col font-bold  pl-2 pr-3 text-[16px] text-text-primary`}>
                        {numeral(resource[3]).format("0.[00]")}
                        <span className="text-[14px] text-text-primary font-medium"> Concrete</span>
                      </span>
                    </div>
                    <div className="flex items-center max-w-[170px]">
                      <div className="size-[48px] flex items-center justify-center bg-[#A0B71B]/15 border-[1px] border-[#A0B71B]/40 rounded-full">
                        <Steel fill="#A0B71B"  height="24" width="24"/>
                      </div>
                      <span className={`flex flex-col font-bold  pl-2 pr-3 text-[16px] text-text-primary`}>
                        {numeral(resource[4]).format("0.[00]")}
                        <span className="fs-xs text-text-primary font-medium"> Steel</span>
                      </span>
                    </div>
                    <div className="relative flex items-center max-w-[170px]">
                      <div className="size-[48px] flex items-center justify-center bg-[#CE8B11]/15 border-[1px] border-[#CE8B11]/40 rounded-full">
                        <EnergyIcon fill="#CE8B11"  height="24" width="24"/>
                      </div>
                      <span
                        className={`font-bold flex flex-col pl-2 pr-3 text-[16px] text-text-primary`}
                      >
                        {numeral(resource[0]).format("0.[00]")} / {maxPowerLimit}
                        <span className="fs-xs text-text-primary font-medium"> Power</span>
                      </span>
                      <span
                        className="absolute right-0 cursor-pointer hover:shadow-md text-[#61CD81] font-medium w-[20px] h-[20px] leading-[20px] text-center rounded-full text-[16px] border-[1px] border-[#61CD81] flex items-center justify-center duration-300 dark:bg-primary dark:text-text-primary"
                        onClick={() => router.push("/nft/resources")}
                      >
                        +
                      </span>
                    </div>
                    <div className="flex items-center max-w-[170px]">
                      <div className="size-[48px] flex items-center justify-center bg-[#AD61CD]/15 border-[1px] border-[#AD61CD]/40 rounded-full">
                        <Brick fill="#AD61CD"  height="24" width="24"/>
                      </div>
                      <span className={`flex flex-col font-bold  pl-2 pr-3 text-[16px] text-text-primary`}>
                        {numeral(resource[2]).format("0.[00]")}
                        <span className="fs-xs text-text-primary font-medium"> Brick</span>
                      </span>
                    </div>
                    <div className="flex items-center max-w-[170px]">
                    <div className="size-[48px] flex items-center justify-center bg-[#33AFB7]/15 border-[1px] border-[#33AFB7]/40 rounded-full">
                      <Credit fill="#33AFB7"  height="24" width="24"/>
                    </div>
                      <span className={`flex flex-col font-bold  pl-2 pr-3 text-[16px] text-text-primary`}>
                      {numeral(Number(nftCredits)).format("0.[00]")}
                        <span className="fs-xs text-text-primary font-medium"> Credits</span>
                      </span>
                    </div>
                    <div className="w-[150px]">
                      <SwitchTheme className="!m-0" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
      </section>

  );
};
