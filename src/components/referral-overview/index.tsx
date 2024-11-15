import Image from "next/image";
import resourceLandshare from "../../../public/icons/resource-landshare.png";
import moreInfo from "../../../public/icons/referral-more-info.svg";
import Tooltip from "../common/tooltip";
import { Fuul } from '@fuul/sdk';
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function ReferralOverview() {
  const {address} = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      if(address){
        const res = await Fuul.getPointsLeaderboard({ 
          user_address: address, 
          from: new Date('2000-01-01'),
          to: new Date(),
          user_type: 'end_user',
        });
      }
    }
    
    fetchData();
  }, [address])

  return (
    <div className="flex flex-col  w-full bg-third rounded-2xl p-6 h-auto gap-8 md:gap-[29px] shadow-lg">
      <div className="w-full flex justify-between">
        <p className="text-text-primary font-bold text-lg leading-7">
          Overview
        </p>

        <div className="flex justify-start items-center gap-1">
          <Image
            src={resourceLandshare}
            alt="Referral Overview"
            width={26}
            height={26}
          />
          <div className="flex align-text-bottom gap-1 font-normal text-[14px] leading-7 text-text-secondary">
              10% Commission
          </div>
          <Tooltip
            tooltipClassName="-translate-x-[190px] lg:-translate-x-[100px] "
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in re"
            position="bottom"
          >
            <span className="text-[#61CD81] cursor-pointer ">ⓘ</span>
          </Tooltip>
        </div>
      </div>

      <div className="flex justify-start gap-6">
        <div>
          <p className="text-sm text-text-secondary font-normal leading-7">
            Sign Ups
          </p>
          <p className="font-bold text-lg text-text-primary leading-7">0</p>
        </div>

        <div>
          <p className="text-sm text-text-secondary font-normal leading-7">
            Total Taker Volume
          </p>
          <p className="font-bold text-lg text-text-primary leading-7">
            0 USDT
          </p>
        </div>
      </div>
      <div className="">
        <p className="text-text-secondary text-sm leading-4">
          Tiers are based on referred taker volume in the past 60 days and total
          LSRWA staked.
        </p>
        <div className="flex gap-2">
          <p className="font-bold text-[#61CD81] text-sm mt-[3px] cursor-pointer">
            Learn more
          </p>
          <p className="font-bold text-[#61CD81] text-sm mt-[3px] cursor-pointer">
            Stake LSRWA
          </p>
        </div>
      </div>
    </div>
  );
}
