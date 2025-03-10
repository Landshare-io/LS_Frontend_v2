import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useGlobalContext } from "../../context/GlobalContext";
import Image from "next/image";
import IconBathroom from "../../../public/icons/bathroom.svg";
import IconSofa from "../../../public/icons/sofa.svg";
import { BigNumberish, formatEther } from "ethers";
import Link from "next/link";
import {
  BsArrowRight,
  BsBuilding,
  BsShield,
  BsShieldCheck,
  BsShieldFillCheck,
} from "react-icons/bs";
import { IoLocationOutline, IoTrendingUp } from "react-icons/io5";
import { MdOutlineCandlestickChart } from "react-icons/md";
import CarouselItem from "../common/carousel/carousel-item";
import CarouselControl from "../common/carousel/carousel-control";
import CommonCarousel from "../common/carousel";
import numeral from "numeral";
import Button from "../common/button";
import { FiArrowRight } from "react-icons/fi";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showThumbs, setShowThumbs] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setShowThumbs(window.innerWidth >= 768); // Show thumbs only on md screens (768px+)
    };

    handleResize(); // Set initial state based on screen size
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading || houseInfo?.address == undefined) {
    return (
      <>
        <div className="max-w-[1200px] text-text-primary flex flex-col gap-2 md:gap-8 m-auto my-[10px] px-[10px] pb-[50px]">
          <div className="flex flex-col gap-2">
            {/* Title skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="h-[18px] md:h-[32px] w-3/4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            {/* Property type badge skeleton */}
            <div className="w-[140px] h-[30px] rounded-[20px] bg-gray-200 animate-pulse"></div>
          </div>

          {/* Main content section */}
          <div className="w-full md:gap-[46px] md:grid md:grid-cols-2 flex flex-col gap-4">
            {/* Image carousel skeleton */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-[100vw] md:w-full h-[300px] md:h-[400px] bg-gray-200 rounded-none md:rounded-[13px] animate-pulse"></div>
            </div>

            <div className="justify-between flex flex-col h-[93.5%] gap-4 md:gap-0">
              {/* Property details section skeleton */}
              <section className="flex flex-col gap-3">
                <div className="h-[18px] w-[150px] bg-gray-200 rounded animate-pulse"></div>

                <div className="flex gap-[20px]">
                  <div className="bg-gray-200 h-[22px] w-[120px] rounded-full animate-pulse"></div>
                  <div className="bg-gray-200 h-[22px] w-[120px] rounded-full animate-pulse"></div>
                </div>

                {/* Description skeleton */}
                <div className="flex flex-col gap-2">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
                </div>
              </section>

              <hr className="hidden lg:block border-gray-400/30" />

              {/* Investment details section skeleton (desktop) */}
              <section className="hidden lg:flex flex-col gap-3">
                <div className="h-[18px] w-[150px] bg-gray-200 rounded animate-pulse"></div>

                <div className="flex justify-between pb-4 px-1 lg:pb-0 lg:px-0 gap-8">
                  {/* Three investment cards */}
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex flex-col justify-center bg-gray-100 py-4 px-8 rounded-2xl shadow-lg w-1/3"
                    >
                      <div className="flex items-center gap-1 mb-2">
                        <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="h-[14px] w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-[28px] w-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Investment details section skeleton (tablet) */}
          <section className="hidden md:flex lg:hidden flex-col gap-3">
            <div className="h-[18px] w-[150px] bg-gray-200 rounded animate-pulse"></div>

            <div className="flex justify-between">
              {/* Three investment cards */}
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex flex-col justify-center bg-gray-100 py-4 px-8 rounded-2xl shadow-lg"
                >
                  <div className="flex items-center gap-1 mb-2">
                    <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="h-[14px] w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-[28px] w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </section>

          {/* Investment details section skeleton (mobile) */}
          <section className="flex flex-col gap-2 md:hidden mt-3">
            <div className="h-[16px] w-[150px] bg-gray-200 rounded animate-pulse"></div>

            <div className="flex overflow-hidden">
              <div className="flex flex-col min-w-44 h-[160px] w-full justify-center items-center bg-gray-100 py-4 px-8 rounded-2xl shadow-md mx-2">
                <div className="flex items-center gap-1 mb-2">
                  <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="h-[14px] w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-[28px] w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Carousel dots */}
            <div className="flex justify-center mt-4 gap-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`w-2 h-2 rounded-full ${
                    item === 1 ? "bg-gray-400" : "bg-gray-200"
                  }`}
                ></div>
              ))}
            </div>
          </section>
        </div>

        {/* Bottom CTA section skeleton */}
        <div className="bg-gray-100 py-[25px] flex flex-col text-center justify-center">
          <div className="max-w-[1200px] m-auto">
            <div className="flex flex-col gap-[15px] text-center items-center">
              <div className="h-[28px] w-[200px] bg-gray-200 rounded animate-pulse mx-auto"></div>
              <div className="h-[18px] w-[250px] bg-gray-200 rounded animate-pulse mx-auto"></div>
              <div className="w-[180px] h-[40px] rounded-[50px] bg-gray-200 animate-pulse mx-auto mt-2"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {houseInfo?.address ? (
        <>
          <div className="max-w-[1200px] text-text-primary flex flex-col gap-2 md:gap-8 m-auto my-[10px] px-[10px] pb-[50px] ">
            <div className="flex flex-col gap-2">
              <h1
                className={`${BOLD_INTER_TIGHT.className} leading-normal text-[18px] md:text-[32px] flex  items-center`}
              >
                <IoLocationOutline /> {houseInfo?.address}
              </h1>
              <span className="w-fit h-[30px] rounded-[20px] flex gap-1 justify-center items-center font-medium text-[12px] px-2 py-1  tracking-[0.02em] text-primary-green bg-secondary  dark:text-text-fourth">
                Single Family Home
              </span>
            </div>
            {/* second section */}
            <div className="w-full md:gap-[46px] md:grid md:grid-cols-2 flex flex-col gap-4">
              <div className="flex flex-col items-center justify-center">
                <div className="w-[100vw] md:w-full ">
                  <Carousel showThumbs={showThumbs} className="w-full relative">
                    {houseInfo?.pictures?.map((imgObj: any) => (
                      <div key={imgObj}>
                        <img
                          className="rounded-none md:rounded-[13px]"
                          src={imgObj}
                          alt=""
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
              </div>
              <div className="justify-between flex flex-col h-[93.5%] gap-4 md:gap-0">
                <section className="flex flex-col gap-3">
                  <h3
                    className={`${BOLD_INTER_TIGHT.className} text-[16px] lg:text-[18px]`}
                  >
                    Property Details
                  </h3>
                  <div className="flex gap-[20px]">
                    {houseInfo?.bedrooms && (
                      <div className="bg-secondary px-2 rounded-full text-primary-green flex items-center gap-[5px]">
                        <Image src={IconSofa} className="size-4" alt="sofa" />
                        <span className="text-[14px] leading-[22px] ">
                          {houseInfo?.bedrooms} Bedrooms
                        </span>
                      </div>
                    )}
                    {houseInfo?.bathrooms && (
                      <div className="bg-secondary px-2 rounded-full text-primary-green flex items-center gap-[5px]">
                        <Image
                          src={IconBathroom}
                          className="size-4"
                          alt="sink"
                        />
                        <span className="text-[14px] leading-[22px]">
                          {houseInfo?.bathrooms} Bathrooms
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    className="flex flex-col  text-[14px] lg:text-[16px] gap-3 text-[#0A1339]/60 dark:text-text-third font-normal"
                    dangerouslySetInnerHTML={{ __html: houseInfo?.description }}
                  ></div>
                </section>
                <hr className="hidden lg:block border-gray-400/30" />
                <section className="hidden lg:flex flex-col gap-3">
                  <h3
                    className={`${BOLD_INTER_TIGHT.className} text-[16px] lg:text-[18px]`}
                  >
                    Investment Details
                  </h3>
                  <div className="flex justify-between  pb-4 px-1 lg:pb-0 lg:px-0  gap-8">
                    <div className="flex flex-col  justify-center bg-secondary py-4 px-8 rounded-2xl shadow-lg">
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
                    <div className="flex flex-col  justify-center bg-secondary py-4 px-8 rounded-2xl shadow-lg">
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
                    <div className="flex flex-col  justify-center bg-secondary py-4 px-8 rounded-2xl shadow-lg">
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

            {/* investment details middle section */}
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
                <div className="flex flex-col justify-center bg-secondary py-4 px-8 rounded-2xl shadow-lg">
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
            {/* investment details mobile */}
            <section className="flex flex-col gap-2 md:hidden mt-3">
              <h3
                className={`${BOLD_INTER_TIGHT.className} text-[16px] lg:text-[18px]`}
              >
                Investment Details
              </h3>
              <CommonCarousel
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                setPaused={setPaused}
              >
                <CarouselItem
                  variant="allowShadow"
                  activeIndex={activeIndex}
                  containerClassName="w-fit"
                >
                  <div className="flex flex-col min-w-44 h-[160px] justify-center items-center bg-secondary py-4 px-8 rounded-2xl shadow-md">
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
                </CarouselItem>

                <CarouselItem
                  variant="allowShadow"
                  activeIndex={activeIndex}
                  containerClassName="w-fit"
                >
                  <div className="flex flex-col min-w-44 h-[160px] justify-center items-center bg-secondary py-4 px-8 rounded-2xl shadow-md">
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
                </CarouselItem>

                <CarouselItem
                  variant="allowShadow"
                  activeIndex={activeIndex}
                  containerClassName="w-fit"
                >
                  <div className="flex flex-col min-w-44 h-[160px] justify-center items-center bg-secondary py-4 px-8 rounded-2xl shadow-md">
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
                </CarouselItem>
              </CommonCarousel>
              <CarouselControl
                paused={paused}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                carouselControlClass={"max-w-[1200px] m-auto mt-[32px]"}
                count={3}
              />
            </section>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-emerald-900/20 dark:to-teal-900/20 py-8 md:py-10 shadow-sm">
            <div className="max-w-[1200px] mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
                {/* Left side: Stats */}
                <div className="flex flex-col items-center md:items-start space-y-3 md:flex-1">
                  <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs md:text-sm text-primary-green font-medium">
                      POTENTIAL EARNINGS
                      <div className="bg-primary-green h-[1px] w-5 mt-1 mb-2 block md:hidden">
                        {" "}
                      </div>
                    </span>
                    <div className="flex justify-between w-full ">
                      <h2 className="flex-col  items-start md:flex-row text-lg md:text-3xl text-gray-800 dark:text-gray-100 font-bold flex md:items-center gap-2">
                        <span className="inline-flex items-center bg-green-100 dark:bg-emerald-800/40 px-3 py-1 rounded-full">
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
                        <span>Rental Yield</span>
                      </h2>
                      <h2 className="flex-col items-start md:flex-row md:hidden text-lg md:text-3xl text-gray-800 dark:text-gray-100 font-bold flex md:items-center gap-2">
                        <span className="inline-flex items-center bg-green-100 dark:bg-emerald-800/40 px-3 py-1 rounded-full">
                          $
                          {numeral(
                            (houseInfo?.grossRent -
                              (houseInfo?.insurance +
                                houseInfo?.tax +
                                houseInfo?.management *
                                  houseInfo?.grossRent *
                                  12) /
                                12) *
                              12
                          ).format("0,0")}
                        </span>
                        <span>Annual Earnings</span>
                      </h2>
                    </div>
                  </div>

                  <p className="hidden md:block text-sm md:text-lg text-gray-600 dark:text-gray-300">
                    LSRWA Holders Earn Up To:{" "}
                    <span className="font-bold text-lg md:text-xl text-gray-800 dark:text-white">
                      $
                      {numeral(
                        (houseInfo?.grossRent -
                          (houseInfo?.insurance +
                            houseInfo?.tax +
                            houseInfo?.management * houseInfo?.grossRent * 12) /
                            12) *
                          12
                      ).format("0,0")}
                    </span>
                  </p>
                </div>

                {/* Right side: CTA button with graphic */}
                <div className="flex flex-col items-center md:items-end space-y-2 md:flex-1">
                  <div className="hidden md:block  w-32 h-1 bg-gradient-to-r from-primary-green to-green-500 rounded-full mb-2"></div>
                  <Link
                    href="/rwa"
                    className="flex items-center gap-2 text-[18px] bg-primary-green rounded-full duration-300 font-semibold md:text-[20px] py-[5px] px-[20px] border-[2px] border-primary-green text-white hover:bg-transparent hover:text-primary-green"
                  >
                    Trade on RWA Portal
                    <FiArrowRight />
                  </Link>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Start investing in minutes
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-secondary flex w-full justify-center text-text-secondary py-2 border-y-[1px] border-text-secondary/15">
            <div className="w-[1200px] flex justify-between px-4  items-center">
              <p className="text-[10px] lg:text-[12px] flex items-center gap-1">
                <BsShieldFillCheck className="text-primary-green" />
                Secured & Regulated Investment
              </p>
              <p className="text-[10px] lg:text-[12px]">Rates updated: March 5th, 2025</p>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
