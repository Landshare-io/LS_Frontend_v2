"use client";
import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import { useGlobalContext } from "../../context/GlobalContext";
import { DASHBOARD_FEATURE } from "../../utils/type";
import Button from "../common/button";

export default function FeatureCard({
  icon,
  darkIcon,
  title,
  description,
  routeName,
  externalLink
}: DASHBOARD_FEATURE) {
  const router = useRouter();
  const { theme } = useGlobalContext();
  const navigate = () => {
    if (routeName) {
      router.push(routeName);
      window.scrollTo(0, 0);
    }
    if (externalLink) window.open(externalLink);
  }
  return (
    <div className="bg-transparent">
      <div className="relative ml-[-10px] p-0 md:ml-[-25px]">
        <div className="bg-primary absolute w-[128px] h-[128px] rounded-[50%] flex justify-center items-center left-0 top-0 z-[9] ml-[-3px] mlg:w-[222px] mlg:h-[202.6px] mlg:top-0 mlg:translate-y-0 mlg:ml-[-29px]">
          <div className="bg-secondary w-[105px] h-[105px] rounded-[50%] flex justify-center items-center mlg:w-[174px] mlg:h-[174px]">
            <Image 
              className="w-[42px] h-[42px] mlg:w-[56px] mlg:h-[56px]" 
              src={theme == 'dark' ? darkIcon : icon} 
              alt="coin stacked" 
            />
          </div>
        </div>
        <div className="flex w-full h-[135.8px] py-[7.4px] px-0 mlg:h-[202.6px]">
          <div className="bg-transparent w-[124px] mlg:w-[203px]"></div>
          <div className="bg-secondary py-[12px] pr-[12.5px] pl-[60px] w-full rounded-[6px] flex flex-col justify-between mlg:pt-[24px] mlg:pr-[32px] mlg:pb-[25px] mlg:pl-[80px]">
            <div className="flex flex-col gap-[2px] mlg:gap-[5px]">
              <h4 className={`text-text-primary text-[18px] leading-[28px] mlg:text-[24px] mlg:leading-[30px] ${BOLD_INTER_TIGHT.className}`}>{title}</h4>
              <p className="text-text-secondary text-[12px] leading-[18px] mlg:text-[14px] mlg:leading-[22px] overflow-hidden text-ellipsis">{description}</p>
            </div>
            <Button 
              className="w-fit py-[1px] px-[2px] !border-0 mlg:px-[20px] mlg:py-[9px] mlg:!border-[1px] rounded-[100px]"
              textClassName="text-[#61cd81] mlg:text-[#3c3c3c] dark:text-[#fff]"
              outlined 
              onClick={navigate}
            >
              View Feature
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
