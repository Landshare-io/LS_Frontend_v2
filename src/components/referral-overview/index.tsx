import Image from "next/image";
import resourceLandshare from "../../../public/icons/resource-landshare.png";
import moreInfo from "../../../public/icons/referral-more-info.svg";
import Tooltip from "../common/tooltip";

export default function ReferralOverview() {
  return (
    <div className="flex flex-col lg:w-[617px] w-full bg-third rounded-2xl p-6 h-auto gap-8 md:gap-[29px] shadow-md">
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
          <Tooltip
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in re"
            position="bottom"
          >
            <p className="font-bold text-lg leading-7 text-text-primary cursor-pointer">
              Tier 1
            </p>
          </Tooltip>
          <p className="font-normal leading-7 text-text-secondary">
            10%commission
          </p>
          <Image
            src={moreInfo}
            alt="Referral Overview"
            width={20}
            height={24}
          />
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
        <p className="font-bold text-[#61CD81] text-sm mt-[3px]">
          <span className="underline cursor-pointer">Learn more</span>
          &nbsp;&nbsp;
          <span className="underline cursor-pointer">Stake LSRWA</span>
        </p>
      </div>
    </div>
  );
}
