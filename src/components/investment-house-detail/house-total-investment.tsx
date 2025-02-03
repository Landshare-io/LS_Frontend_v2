import React from "react";
import Link from "next/link";
import { formatEther, BigNumberish } from "ethers";
import ReactLoading from "react-loading";

interface HouseTotalInvestMentProps {
  houseInfo: any
  isLoading: boolean
  propertyValue: BigNumberish
}

function calculateRentalYield(houseInfo: any, propertyValue: BigNumberish) {
  if (
    !houseInfo ||
    !propertyValue ||
    propertyValue === 0 ||
    isNaN(houseInfo?.grossRent) ||
    isNaN(houseInfo?.management) ||
    isNaN(houseInfo?.insurance) ||
    isNaN(houseInfo?.tax)
  ) {
    return "Invalid input values";
  }

  let value =
    houseInfo.grossRent * (1 - houseInfo.management) * 12 -
    houseInfo.insurance -
    houseInfo.tax;
  value = value / Number(formatEther(propertyValue));
  value = value * 100;

  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function HouseTotalInvestMent({
  houseInfo,
  isLoading,
  propertyValue,
}: HouseTotalInvestMentProps) {
  return (
    <>
      <div className="bg-third py-[25px] flex flex-col text-center justify-center">
        <div className="max-w-[1200px] m-auto">
          {isLoading == true ? (
            <ReactLoading
              type="balls"
              className="mb-[4px]"
              width="70px"
              height="24px"
              color="#61CD81"
            />
          ) : (
            <div className="flex flex-col gap-[15px] text-center items-center">
              <h2 className="text-[20px] font-semibold md:text-[28px] text-text-primary">
                Property Value: ${Number(formatEther(propertyValue)).toLocaleString()}
              </h2>
              <p className="text-[16px] md:text-[18px] font-semibold text-text-secondary ">
                Rental Yield: {calculateRentalYield(houseInfo, propertyValue)}%
              </p>
              <Link
                href="/rwa"
                className="w-fit text-[17px] bg-[#61cd81] rounded-[50px] duration-300 font-semibold md:text-[20px] py-[5px] px-[20px] border-[2px] border-[#61CD81] text-button-text-secondary hover:bg-transparent hover:text-[#61CD81]"
              >
                Trade on RWA Portal
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
