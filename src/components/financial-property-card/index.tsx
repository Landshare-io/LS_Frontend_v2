import { useState, useEffect } from "react";
import Image from "next/image";
import { BsInfoCircle } from "react-icons/bs";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import OverlayTrigger from "../common/overlay-trigger";
import IconRefresh from "../../../public/icons/refresh.svg";
import capRate from "../../../public/icons/dollars.svg";
import Est from "../../../public/icons/raised.svg";
import myRwa from "../../../public/icons/coin-stacked-small.svg";
import { useGlobalContext } from "../../context/GlobalContext";
import { StringKeyStringValueObject } from "../../utils/type";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";

const iconUrl: StringKeyStringValueObject = {
  "Rental Yield": capRate,
  "Est. Appreciation": Est,
  "Ann. Return": IconRefresh,
  "Market Cap": Est,
  "Circulating Supply": myRwa,
  "Current Price": capRate
}

const tips: StringKeyStringValueObject = {
  "Rental Yield": "",
  "Est. Appreciation": "Estimated capital appreciation based on market projections. Appreciation is estimated for your information only, and is subject to change at any time",
  "Ann. Return": "Total return when accounting for both rental yield and appreciation",
  "Market cap": "",
  "Circulating Supply": "",
  "Cap Rate": "",
  "Current Price": ""
}

interface FinancialPropertyCardProps {
  title: string;
  value: string;
  loading: boolean;
  page?: string;
}

export default function FinancialPropertyCard ({ title, value, loading, page }: FinancialPropertyCardProps) {
  const [currentLoading, setCurrentLoading] = useState(false);
  const { theme } = useGlobalContext();
  useEffect(() => {
    setCurrentLoading(loading)
  }, [loading]);

  return (
    <div className={`${page == "rwa" ? "bg-third" : "bg-third md:bg-secondary"} rwa-property-card flex flex-col justify-center items-center md:items-start`}>
      <div className="flex flex-col gap-[10px] rwa-property-card-detail">
        <span className="text-text-secondary justify-center font-medium text-[14px] leading-[22px] min-w-[180px] md:justify-start flex gap-1 items-center relative">
          {title}
          {tips[title] != "" && <OverlayTrigger
            placement="bottom"
            overlay={
              <span>{tips[title]}</span>
            }
          >
            <BsInfoCircle id="tooltip-icon" className="w-4 h-4 cursor-pointer z-50" />
          </OverlayTrigger>}
        </span>
        <SkeletonTheme 
          baseColor={`${theme == 'dark' ? "#31333b" : "#dbdde0"}`} 
          highlightColor={`${theme == 'dark' ? "#52545e" : "#f6f7f9"}`}
        >
          <div className="flex gap-[8px]">
            <div className="bg-primary w-[32px] h-[32px] py-[6.23px] px-[7px] flex items-center justify-center rounded-full">
              <Image src={iconUrl[title] ? iconUrl[title] : iconUrl["Est. Appreciation"]} alt="refresh" className="w-[18px]" />
            </div>
            {currentLoading == true || value == "NaN%" || value == "Infinity%" ? (
              <Skeleton className="rounded-lg" width={100} height={28} />
            ) : (
              <span className={`text-text-primary text-[24px] leading-[30px] ${BOLD_INTER_TIGHT.className}`}>{value}</span>
            )}
          </div>
        </SkeletonTheme>
      </div>
    </div>

  );
};
