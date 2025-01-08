import { useState, useEffect } from "react";
import Image from "next/image";
import { BsInfoCircle } from "react-icons/bs";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import OverlayTrigger from "../common/overlay-trigger";
import IconRefresh from "../../../public/icons/refresh.svg";
import capRate from "../../../public/icons/dollars.svg";
import Est from "../../../public/icons/raised.svg";
import myRwa from "../../../public/icons/coin-stacked-small.svg";
import burnFire from "../../../public/icons/burn-fire.svg";
import { useGlobalContext } from "../../context/GlobalContext";
import { StringKeyStringValueObject } from "../../utils/type";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import "react-loading-skeleton/dist/skeleton.css";
import Tooltip from "../common/tooltip";

const iconUrl: StringKeyStringValueObject = {
  "Rental Yield": capRate,
  "Est. Appreciation": Est,
  "Ann. Return": IconRefresh,
  "Market Cap": Est,
  "Circulating Supply": myRwa,
  "Current Price": capRate,
  "Burned Amount": burnFire,
};

const tips: StringKeyStringValueObject = {
  "Rental Yield": "",
  "Est. Appreciation":
    "Estimated capital appreciation based on market projections. Appreciation is estimated for your information only, and is subject to change at any time",
  "Ann. Return":
    "Total return when accounting for both rental yield and appreciation",
  "Market cap": "",
  "Circulating Supply": "",
  "Cap Rate": "",
  "Current Price": "",
  "Burned Amount": "",
};

interface FinancialPropertyCardProps {
  title: string;
  value: string;
  loading?: boolean;
  page?: string;
  className?: string;
}

export default function FinancialPropertyCard({
  title,
  value,
  loading = false,
  page,
  className,
}: FinancialPropertyCardProps) {
  const [currentLoading, setCurrentLoading] = useState(false);
  const { theme } = useGlobalContext();
  useEffect(() => {
    setCurrentLoading(loading);
  }, [loading]);

  return (
    <div
      className={`${
        page == "rwa" ? "dark:bg-third" : "dark:bg-third md:bg-secondary"
      } ${className} bg-primary w-full py-[32px] px-[24px] gap-[10px] h-[160px] rounded-[16px] min-w-max flex flex-col justify-center items-center md:items-start`}
    >
      <div></div>
      <div className="flex flex-col gap-[10px] text-center">
        <span className="text-text-secondary justify-start font-medium text-[14px] leading-[22px] md:min-w-[180px] md:justify-start flex gap-1 items-center relative">
          {title}
        </span>
        <SkeletonTheme
          baseColor={`${theme == "dark" ? "#31333b" : "#dbdde0"}`}
          highlightColor={`${theme == "dark" ? "#52545e" : "#f6f7f9"}`}
        >
          <div className="flex gap-[8px]">
            <div className="md:bg-primary bg-secondary h-[32px] flex items-center justify-start rounded-full">

              <Image
                src={
                  iconUrl[title] ? iconUrl[title] : iconUrl["Est. Appreciation"]
                }
                alt="refresh"
                className="size-[18px]"
              />
            </div>
            {currentLoading == true ||
            value == "NaN%" ||
            value == "Infinity%" ? (
              <Skeleton className="rounded-lg" width={100} height={28} />
            ) : (
              <span
                className={`w-fit text-text-primary text-[24px] leading-[30px] ${BOLD_INTER_TIGHT.className}`}
              >
                {value}
              </span>
            )}
          </div>
        </SkeletonTheme>
      </div>
      <div></div>
    </div>
  );
}
