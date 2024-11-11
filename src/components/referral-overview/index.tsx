import Image from "next/image";
import resourceLandshare from "../../../public/icons/resource-landshare.png";
import moreInfo from "../../../public/icons/referral-more-info.svg"

export default function ReferralOverview (){
    return(
    <div className="flex flex-col lg:w-[617px] w-full bg-white rounded-2xl p-6 h-[240px] md:h-[217px] gap-8 md:gap-[29px]">
        <div className="w-full flex justify-between">
            <p className="font-bold text-lg leading-7 text-[#0A0A0A]">Overview</p>

            <div className="flex justify-start items-center gap-1">
                <Image src={resourceLandshare} alt="Referral Overview" width={26} height={26}/>
                <p className="font-bold text-lg leading-7 text-black">Tier 1</p>
                <p className="font-normal text-[#535457] leading-7">10%commission</p> 
                <Image src={moreInfo} alt="Referral Overview" width={20} height={24}/>
            </div>
        </div>

        <div className="flex justify-start gap-6">
            <div>
                <p className="text-sm text-[#535457] font-normal leading-7">Sign Ups</p>
                <p className="font-bold text-lg text-black leading-7">0</p>
            </div>

            <div>
                <p className="text-sm text-[#535457] font-normal leading-7">Total Taker Volume</p>
                <p className="font-bold text-lg text-black leading-7">0 USDT</p>
            </div>
        </div>

        <div className="]">
            <p className="text-[#535457] text-sm leading-4">Tiers are based on referred taker volume in the past 60 days and total LSRWA staked.</p>
            <p className="font-bold text-[#61CD81] text-sm mt-[3px]"><span className="underline">Learn more</span>  <span className="underline">Stake LSRWA</span></p>
        </div>
    </div>)
}