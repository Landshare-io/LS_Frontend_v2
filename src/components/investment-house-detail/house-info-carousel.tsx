import React from "react";
import { Carousel } from "react-responsive-carousel";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useGlobalContext } from "../../context/GlobalContext";
import Image from "next/image";
import IconBathroom from "../../../public/icons/bathroom.svg";
import IconSofa from "../../../public/icons/sofa.svg";
import { BigNumberish, formatEther } from "ethers";
import Button from "../common/button";
import numeral from "numeral";
import Link from "next/link";
import { BsBuilding } from "react-icons/bs";
import {
  IoHomeOutline,
  IoLocationOutline,
  IoTrendingUp,
} from "react-icons/io5";
import { MdOutlineCandlestickChart } from "react-icons/md";

interface HouseInfoCarouselComponentProps {
  houseInfo: any;
  isLoading: boolean;
  propertyValue: BigNumberish;
}

export default function HouseInfoCarouselComponent({
  houseInfo,
  isLoading,
  propertyValue,
}: HouseInfoCarouselComponentProps) {
  const { theme } = useGlobalContext();
  if (isLoading || houseInfo?.address == undefined) {
    return (
      <div className="max-w-[1200px] m-auto my-[10px] px-[10px]">
        <div className="">
          <div className="animate-pulse">
            <div className="h-[30px] w-[200px] bg-gray-300 mb-2 rounded-[20px]"></div>
            <div className="h-[32px] w-[60%] bg-gray-300"></div>
          </div>

          <div className="w-full gap-[28px] flex flex-col md:flex-row justify-between mt-4">
            <div className="min-w-[40%] flex flex-col items-center justify-center">
              <div className="w-full">
                <div className="animate-pulse h-[260px] md:h-[392px] bg-gray-300 rounded-[13px]"></div>
              </div>
            </div>

            <div className="justify-between flex flex-col w-[60%]">
              <section className="flex flex-col gap-3">
                <div className="animate-pulse">
                  <div className="h-[18px] w-[150px] bg-gray-300 mb-2"></div>
                  <div className="flex gap-[20px]">
                    <div className="h-[22px] w-[100px] bg-gray-300"></div>
                    <div className="h-[22px] w-[100px] bg-gray-300"></div>
                  </div>
                  <div className="mt-2">
                    <div className="h-[14px] w-full bg-gray-300 mb-1"></div>
                    <div className="h-[14px] w-[95%] bg-gray-300 mb-1"></div>
                    <div className="h-[14px] w-[90%] bg-gray-300"></div>
                  </div>
                </div>
              </section>

              <hr className="my-4" />

              <section className="flex flex-col gap-3">
                <div className="animate-pulse">
                  <div className="h-[18px] w-[150px] bg-gray-300 mb-2"></div>
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <div className="h-[12px] w-[100px] bg-gray-300 mb-1"></div>
                      <div className="h-[28px] w-[120px] bg-gray-300"></div>
                    </div>
                    <div className="flex flex-col">
                      <div className="h-[12px] w-[100px] bg-gray-300 mb-1"></div>
                      <div className="h-[28px] w-[120px] bg-gray-300"></div>
                    </div>
                    <div className="flex flex-col">
                      <div className="h-[12px] w-[100px] bg-gray-300 mb-1"></div>
                      <div className="h-[28px] w-[120px] bg-gray-300"></div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-start">
                    <div className="h-[44px] w-[165px] bg-gray-300 rounded-[100px]"></div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {houseInfo?.address ? (
        <div className="max-w-[1200px] text-text-primary flex flex-col gap-2 md:gap-8 m-auto my-[10px] px-[10px] pb-[50px] ">
          <div className="flex flex-col gap-2">
            <span className="w-fit h-[30px] rounded-[20px] flex gap-1 justify-center items-center font-medium text-[12px] px-2 py-1  tracking-[0.02em] text-primary-green bg-secondary  dark:text-text-fourth">
              <div className="rounded-full bg-primary flex items-center justify-center h-full aspect-square">
                <IoHomeOutline />
              </div>
              Single Family Home
            </span>
            <h1
              className={`${BOLD_INTER_TIGHT.className} leading-normal text-[18px] md:text-[32px] flex  items-center`}
            >
              <IoLocationOutline /> {houseInfo?.address}
            </h1>
          </div>
          {/* second section */}
          <div className="w-full md:gap-[46px] md:grid md:grid-cols-[40%_56%] flex flex-col ">
            <div className="flex flex-col items-center justify-center">
              <div className="w-full">
                <Carousel className="w-full relative">
                  {houseInfo?.pictures?.map((imgObj: any) => (
                    <div key={imgObj}>
                      <img className="rounded-[13px]" src={imgObj} alt="" />
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
            <div className="justify-between  flex flex-col h-[93.5%] gap-4 md:gap-0">
              <section className="flex flex-col gap-3">
                <h3 className={`${BOLD_INTER_TIGHT.className} text-[16px] lg:text-[18px]`}>
                  Property Details
                </h3>
                <div className="flex gap-[20px]">
                  {houseInfo?.bedrooms && (
                    <div className="flex items-center gap-[5px]">
                      <Image src={IconSofa} className="size-4" alt="sofa" />
                      <span className="text-[14px] leading-[22px] text-text-third">
                        {houseInfo?.bedrooms} Bedrooms
                      </span>
                    </div>
                  )}
                  {houseInfo?.bathrooms && (
                    <div className="flex items-center gap-[5px]">
                      <Image src={IconBathroom} className="size-4" alt="sink" />
                      <span className="text-[14px] leading-[22px] text-text-third">
                        {houseInfo?.bathrooms} Bathrooms
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className="flex flex-col  text-[14px]  text-text-third"
                  dangerouslySetInnerHTML={{ __html: houseInfo?.description }}
                ></div>
              </section>
              <hr className="md:hidden lg:block border-gray-400" />
              <section className="flex md:hidden lg:flex flex-col gap-3">
                <h3 className={`${BOLD_INTER_TIGHT.className} text-[16px] lg:text-[18px]`}>
                  Investment Details
                </h3>
                <div className="flex justify-between overflow-x-auto pb-4 px-1 lg:pb-0 lg:px-0  lg:overflow-x-visible gap-8">
                  <div className="flex flex-col min-w-44 justify-center bg-secondary py-4 px-8 rounded-2xl shadow-lg">
                    <label className="text-[14px] flex items-center gap-1 leading-[20px] text-center tracking-[0.02em] text-text-secondary">
                      <BsBuilding className="text-primary-green" />
                      Property Value
                    </label>

                    <span
                      className={`text-[18px] leading-[28px] tracking-[0.02em] text-text-primary ${BOLD_INTER_TIGHT.className}`}
                    >
                      ${Number(formatEther(propertyValue)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-44 justify-center bg-secondary py-4 px-8 rounded-2xl shadow-lg">
                    <label className="text-[14px] flex items-center gap-1 leading-[20px] text-center tracking-[0.02em] text-text-secondary">
                      <IoTrendingUp className="text-primary-green" />
                      Rental Yield
                    </label>
                    <span
                      className={`text-[18px] leading-[28px] tracking-[0.02em] text-text-primary ${BOLD_INTER_TIGHT.className}`}
                    >
                      {(
                        ((houseInfo?.grossRent *
                          (1 - houseInfo?.management) *
                          12 -
                          houseInfo?.insurance -
                          houseInfo?.tax) /
                          Number(formatEther(propertyValue))) *
                        100
                      ).toFixed(2)}
                      %
                    </span>
                  </div>
                  <div className="flex flex-col min-w-44 justify-center bg-secondary py-4 px-8 rounded-2xl shadow-lg">
                    <label className="text-[14px] flex items-center gap-1 leading-[20px] text-center tracking-[0.02em] text-text-secondary">
                      <MdOutlineCandlestickChart className="text-primary-green" />
                      Ann. Return
                    </label>

                    <span
                      className={`text-[18px] leading-[28px] tracking-[0.02em] text-text-primary ${BOLD_INTER_TIGHT.className}`}
                    >
                      {(
                        ((houseInfo?.grossRent *
                          (1 - houseInfo?.management) *
                          12 -
                          houseInfo?.insurance -
                          houseInfo?.tax) /
                          Number(formatEther(propertyValue))) *
                          100 +
                        houseInfo?.appreciation
                      ).toFixed(2)}
                      %
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div className="flex md:hidden lg:flex w-full justify-center">
            <Link href="/rwa">
              <Button
                className={`w-fit h-[48px] px-6 text-white rounded-[100px] bg-[#61cd81]`}
                textClassName=" text-[100%]"
              >
                LSRWA Holders Earn Up To $
                {numeral(
                  (houseInfo?.grossRent -
                    (houseInfo?.insurance +
                      houseInfo?.tax +
                      houseInfo?.management * houseInfo?.grossRent * 12) /
                      12) *
                    12
                ).format("0,0")}
              </Button>
            </Link>
          </div>
          {/* cta middle section */}
          <section className="hidden md:flex lg:hidden flex-col gap-3">
            <h3 className={`${BOLD_INTER_TIGHT.className} text-[18px]`}>
              Investment Details
            </h3>
            <div className="flex justify-between">
            <div className="flex flex-col justify-center bg-secondary py-4 px-8 rounded-2xl shadow-lg">
            <label className="text-[14px] flex items-center gap-1 leading-[20px] text-center tracking-[0.02em] text-text-secondary">
                  <BsBuilding className="text-primary-green" />
                  Property Value
                </label>

                <span
                  className={`text-[18px] leading-[28px] tracking-[0.02em] text-text-primary ${BOLD_INTER_TIGHT.className}`}
                >
                  ${Number(formatEther(propertyValue)).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col justify-center bg-secondary py-4 px-8 rounded-2xl shadow-lg">
              <label className="text-[14px] flex items-center gap-1 leading-[20px] text-center tracking-[0.02em] text-text-secondary">
                  <IoTrendingUp className="text-primary-green" />
                  Rental Yield
                </label>
                <span
                  className={`text-[18px] leading-[28px] tracking-[0.02em] text-text-primary ${BOLD_INTER_TIGHT.className}`}
                >
                  {(
                    ((houseInfo?.grossRent * (1 - houseInfo?.management) * 12 -
                      houseInfo?.insurance -
                      houseInfo?.tax) /
                      Number(formatEther(propertyValue))) *
                    100
                  ).toFixed(2)}
                  %
                </span>
              </div>
              <div className="flex flex-col justify-center bg-secondary py-4 px-8 rounded-2xl shadow-lg">
              <label className="text-[14px] flex items-center gap-1 leading-[20px] text-center tracking-[0.02em] text-text-secondary">
                  <MdOutlineCandlestickChart className="text-primary-green" />
                  Ann. Return
                </label>

                <span
                  className={`text-[18px] leading-[28px] tracking-[0.02em] text-text-primary ${BOLD_INTER_TIGHT.className}`}
                >
                  {(
                    ((houseInfo?.grossRent * (1 - houseInfo?.management) * 12 -
                      houseInfo?.insurance -
                      houseInfo?.tax) /
                      Number(formatEther(propertyValue))) *
                      100 +
                    houseInfo?.appreciation
                  ).toFixed(2)}
                  %
                </span>
              </div>
            </div>
            <Link href="/rwa">
              <Button
                className={`w-fit h-[48px] px-6 text-white rounded-[100px] bg-[#61cd81]`}
                textClassName="hover:dark:text-[#61CD81] text-[100%]"
              >
                LSRWA Holders Earn Up To $
                {numeral(
                  (houseInfo?.grossRent -
                    (houseInfo?.insurance +
                      houseInfo?.tax +
                      houseInfo?.management * houseInfo?.grossRent * 12) /
                      12) *
                    12
                ).format("0,0")}
              </Button>
            </Link>
          </section>
        </div>
      ) : null}
    </>
  );
}
