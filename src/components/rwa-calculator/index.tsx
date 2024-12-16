import { useState, useEffect } from "react";
import { useChainId } from "wagmi";
import { BigNumberish, formatEther } from "ethers";
import { IoIosTrendingUp } from "react-icons/io";
import Logo from "../common/logo";
import Button from "../common/button";
import {
  getData,
  selectNetRentalPerMonth,
  selectAppreciation,
} from "../../lib/slices/firebase-slices/properties-rental";
import useGetTotalValue from "../../hooks/contract/APIConsumerContract/useGetTotalValue";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import Link from "next/link";

export default function RwaCalculator() {
  const chainId = useChainId();
  const dispatch = useAppDispatch();
  const netRentalPerMonth = useAppSelector(selectNetRentalPerMonth);
  const totalPropertyValue = useGetTotalValue(chainId) as BigNumberish;
  const appreciation = useAppSelector(selectAppreciation);
  const [initialInvestment, setInitialInvestment] = useState(5500);

  useEffect(() => {
    dispatch(getData());
  }, [dispatch]);

  let totalAnnualReturns =
    ((netRentalPerMonth * 12) / Number(formatEther(totalPropertyValue))) * 100 +
    appreciation / Number(totalPropertyValue);

  let annualRentReturn = (
    ((netRentalPerMonth * 12) / Number(formatEther(totalPropertyValue))) *
    100
  ).toFixed(2);

  let annualValueGrowth = (appreciation / Number(formatEther(totalPropertyValue))).toFixed(
    2
  );

  const scrollToElement = () => {
    const element = document.querySelector("#target-element");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="flex flex-col p-0 max-w-[1200px] m-auto gap-[50px]">
      <div className="w-full flex justify-center">
        <div className="flex items-center w-fit py-[6px] bg-white pr-[15px] pl-[6px] gap-[8px] h-[44px] rounded-[50px] text-[14px] font-medium leading-[22px] bg-secondary dark:bg-secondary">
          <div className="flex items-start p-[4px] w-[32px] h-[32px] rounded-[30px] bg-primary">
            <IoIosTrendingUp className="w-[24px] h-[24px] text-[#24BC48]" />
          </div>
          <span className="text-[14px] leading-[22px] tracking-[0.02em] font-bold text-text-primary">
            Estimate your potential earnings
          </span>
        </div>
      </div>
      <div className="flex flex-col w-full lg:flex-row gap-0 items-center p-0 max-w-[700px] lg:max-w-[1200px] m-auto border-[2px] border-[#61CD81] rounded-[24px] overflow-hidden">
        <div className="flex flex-col flex-1 py-[34px] lg:py-[10px] gap-[20px] justify-between px-[30px] h-[238px]">
          <div className="flex flex-col gap-[10px]">
            <h2
              className={`text-[28px] mlg:text-[32px] leading-[24px] text-text-primary font-bold `}
            >
              Calculate returns
            </h2>
            <p className="auto-redeem-option-card-usd font-normal text-text-secondary text-sm">
              Calculate returns effortlessly and make informed financial
              decisions for a brighter future.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[minmax(200px,max-content),minmax(310px,max-content),minmax(50px,max-content)] gap-[20px] gap-y-[10px]">
            <span
              className={`text-[16px] leading-[22px] text-text-primary font-bold `}
            >
              Initial Investment
            </span>
            <input
              type="range"
              min="1000"
              max="10000"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
              className="w-full max-w-auto cursor-pointer md:max-w-[310px] accent-[#61CD81]"
            />
            <span
              className={`text-[18px] leading-[22px] text-[#61CD81] font-bold `}
            >
              ${initialInvestment.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between lg:justify-start items-center gap-[20px] text-text-primary">
            <div className="flex flex-col items-center">
              <p className=" text-text-secondary text-[14px] text-center mb-1 ">
                Annual Rental Yield
              </p>
              <p className={`text-[18px] leading-[22px] font-bold `}>
                {annualRentReturn} %
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-text-secondary text-[14px] text-center mb-1">
                Annual value growth
              </p>
              <p className={`text-[18px] leading-[22px] font-bold `}>
                {annualValueGrowth}%
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-text-secondary text-[14px] text-center mb-1">
                Total annual return
              </p>
              <p className={`text-[18px] leading-[22px] font-bold `}>
                {/* toFixed formatting shall be done here */}
                {totalAnnualReturns.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full max-w-auto bg-gradient-to-b from-[#61CD81] to-[#2B9F49]     lg:max-w-[400px] overflow-hidden py-[24px]  px-[20px] gap-[24px] justify-center items-center">
          <Link
            className="flex items-center gap-[7px] cursor-pointer"
            href="/"
          ></Link>
          <Logo logoClassName="!w-[32px] !h-[32px] mb-[10px]" />
          <div>
            <p
              className={`text-[22px] leading-[32px] text-[#fff] text-center font-bold `}
            >
              Projected value in 5 years
            </p>
            <p
              className={`text-[40px] leading-[42px] text-[#fff] text-center font-bold `}
            >
              ${" "}
              {
                // Initial investment compound growth over 5 years
                (
                  initialInvestment * Math.pow(1 + totalAnnualReturns / 100, 5)
                ).toLocaleString()
              }
            </p>
          </div>

          <button
            onClick={() => scrollToElement()}
            className={`!bg-[#fff] text-[#000] w-full rounded-[100px] py-[10px] text-[16px] leading-[24px] font-bold `}
          >
            Invest Now →
          </button>
          <p className="text-[14px] leading-[22px] font-medium text-[#FFFFFFCC]">
            *Estimated annual returns, using yield statistics from all
            properties on the platform.
          </p>
        </div>
      </div>
    </div>
  );
}
