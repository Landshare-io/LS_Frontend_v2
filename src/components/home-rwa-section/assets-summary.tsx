import { useState, useEffect } from "react";
import { useChainId } from "wagmi";
import { bsc } from "viem/chains";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import FeatureBadge from "../common/feature-badge";
import ToggleButton from "../common/toggle-button";
import Carousel from "../common/carousel";
import { BigNumberish, formatEther } from "ethers";
import CarouselControl from "../common/carousel/carousel-control";
import CarouselItem from "../common/carousel/carousel-item";
import PropertyCard from "../common/property-card";
import FinancialPropertyCard from "../financial-property-card";
import { PROPERTIES } from "../../config/constants/page-data";
import PriceGraph from "../price-line-chart";
import useGetTotalValue from "../../hooks/contract/APIConsumerContract/useGetTotalValue";
import useBalanceOfLandToken from "../../hooks/contract/LandTokenContract/useBalanceOf";
import {
  getData,
  selectLoadingStatus,
  selectNetRentalPerMonth,
  selectPropertiesRentalData,
  selectAppreciation,
} from "../../lib/slices/firebase-slices/properties-rental";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import useGetLandPrice from "../../hooks/axios/useGetLandPrice";

export default function HomeRwaAssetsSummary() {
  const chainId = useChainId();
  const [selectedGraph, setSelectedGraph] = useState("land");
  const dispatch = useAppDispatch();
  const isRwaLoading = useAppSelector(selectLoadingStatus);
  const propertiesRentalData = useAppSelector(selectPropertiesRentalData);
  const netRentalPerMonth = useAppSelector(selectNetRentalPerMonth);
  const appreciation = useAppSelector(selectAppreciation);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const totalPropertyValue = useGetTotalValue(chainId) as BigNumberish;
  const { price: landPrice, isLoading, circulatingSupply } = useGetLandPrice();
  const { data: burnedAmount } = useBalanceOfLandToken({ chainId: bsc.id, address: '0x000000000000000000000000000000000000dEaD' }) as { data: BigNumberish }

  useEffect(() => {
    dispatch(getData());
  }, [dispatch]);

  return (
    <div className="pb-[40px] px-0 md:pl-0 md:pr-0 lg:py-[80px] lg:px-[120px] bg-secondary">
      <div className="flex flex-col items-start md:flex-row justify-between md:items-center gap-[10px] xl:gap-[20px] 2xl:gap-[100px] pt-[70px] pr-0 max-w-[1200px] m-auto">
        <div className="flex flex-col items-start w-full gap-6">
          <div className="px-[10px] md:px-[40px] flex flex-col gap-3 lg:px-0">
            <FeatureBadge
              icon="/icons/wallet.svg"
              text="Real World Assets"
              type="gray"
            />
            <h1
              className={`text-text-primary text-[32px] leading-[36px] md:text-[54px] md:my-[12px] md:mx-0 text-center md:text-start ${BOLD_INTER_TIGHT.className}`}
            >
              Asset Summary
            </h1>
          </div>
          <div className="flex flex-col mlg:flex-row w-full lg:gap-x-0 xl:gap-x-[64px] gap-y-[32px]">
            <div className="flex flex-col flex-1 px-[10px] md:px-[40px] lg:px-0 gap-8">
              <div className="flex items-center gap-[12px]">
                <ToggleButton
                  onClick={() => setSelectedGraph("rwa")}
                  active={selectedGraph == "rwa"}
                  className="w-[122px] h-[32px]"
                >
                  RWA Value
                </ToggleButton>
                <ToggleButton
                  onClick={() => setSelectedGraph("land")}
                  active={selectedGraph == "land"}
                  className="w-[122px] h-[32px]"
                >
                  LAND Price
                </ToggleButton>
              </div>
              <div className="pr-0 w-full">
                <div className="bg-primary rounded-[16px] p-[14px] overflow-visible md:p-[24px]">
                  <PriceGraph type={selectedGraph} showBuyButton={true} />
                </div>
              </div>
            </div>
            <div className="hidden mlg:w-[430px] mlg:mt-[56px] mlg:block mlg:overflow-visible">
              <CarouselControl
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                count={propertiesRentalData.length}
                paused={paused}
                carouselControlClass="mb-[20px] px-[10px] md:px-[20px]"
              />
              <div className="flex justify-center items-center">
                <Carousel
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                  setPaused={setPaused}
                >
                  {propertiesRentalData.map((property: any, i) => {
                    const propertyData = {
                      ...property,
                      type: "Rental Property",
                      preview: PROPERTIES[0].preview,
                    };

                    return (
                      <CarouselItem
                        key={i}
                        containerClassName="w-fit"
                        activeIndex={activeIndex}
                      >
                        <PropertyCard property={propertyData} />
                      </CarouselItem>
                    );
                  })}
                </Carousel>
              </div>
            </div>
          </div>
          <div className="flex md:hidden gap-[24px] mt-[12px] w-full pr-0 lg:pr-[450px] overflow-hidden">
            <div className="w-full mt-0 md:w-[430px] md:mt-[56px] md:overflow-visible p-[20px] translate-y-5">
              <div className="flex items-center justify-center">
                <Carousel
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                  setPaused={setPaused}
                >
                  <CarouselItem
                    variant="allowShadow"
                    activeIndex={activeIndex}
                    containerClassName="w-fit"
                  >
                    <FinancialPropertyCard
                         className="shadow-lg border-[1px] border-primary-green"
                         title={selectedGraph == 'land' ? "Market Cap" : "Rental Yield"}
                         value={selectedGraph == 'land' ? "$" + (circulatingSupply * landPrice).toLocaleString() : (netRentalPerMonth * 12 / Number(formatEther(totalPropertyValue)) * 100).toFixed(3) + "%"}
                         loading={selectedGraph == 'land' ? isLoading : isRwaLoading}
                    />
                  </CarouselItem>
                  <CarouselItem
                    variant="allowShadow"
                    activeIndex={activeIndex}
                    containerClassName="w-fit"
                  >
                    <FinancialPropertyCard
                       className="shadow-lg border-[1px] border-primary-green"
                       title={selectedGraph == 'land' ? "Circulating Supply" : "Est. Appreciation"}
                       value={selectedGraph == 'land' ? circulatingSupply?.toLocaleString() : (appreciation / Number(formatEther(totalPropertyValue))).toFixed(3) + "%"}
                       loading={selectedGraph == 'land' ? isLoading : isRwaLoading}
                    />
                  </CarouselItem>
                  <CarouselItem
                    variant="allowShadow"
                    activeIndex={activeIndex}
                    containerClassName="w-fit"
                  >
                    <FinancialPropertyCard
                        className="shadow-lg border-[1px] border-primary-green"
                        title={selectedGraph == 'land' ? "Burned Amount" : "Ann. Return"}
                        value={selectedGraph == 'land' ? Number.parseFloat(formatEther(burnedAmount).toString()).toFixed(3) : (netRentalPerMonth * 12 / Number(formatEther(totalPropertyValue)) * 100 + appreciation / Number(formatEther(totalPropertyValue))).toFixed(3) + "%"}
                        loading={selectedGraph == 'land' ? isLoading : isRwaLoading}
                      />
                  </CarouselItem>
                </Carousel>
              </div>
              <CarouselControl
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                count={3}
                paused={paused}
                carouselControlClass="px-[10px] md:px-[40px] my-[20px]"
              />
            </div>
          </div>
          <div className="hidden md:flex gap-[24px] mt-[12px] w-full pr-0 lg:pr-[450px] overflow-visible">
            <FinancialPropertyCard
                title={selectedGraph == 'land' ? "Market Cap" : "Rental Yield"}
                value={selectedGraph == 'land' ? "$" + (circulatingSupply * landPrice).toLocaleString() : (netRentalPerMonth * 12 / Number(formatEther(totalPropertyValue)) * 100).toFixed(3) + "%"}
                loading={selectedGraph == 'land' ? isLoading : isRwaLoading}
                />
            <FinancialPropertyCard
                title={selectedGraph == 'land' ? "Circulating Supply" : "Est. Appreciation"}
                value={selectedGraph == 'land' ? circulatingSupply?.toLocaleString() : (appreciation / Number(formatEther(totalPropertyValue))).toFixed(3) + "%"}
                loading={selectedGraph == 'land' ? isLoading : isRwaLoading}
                />
            <FinancialPropertyCard
             title={selectedGraph == 'land' ? "Burned Amount" : "Ann. Return"}
             value={selectedGraph == 'land' ? Number.parseFloat(formatEther(burnedAmount).toString()).toFixed(3) : (netRentalPerMonth * 12 / Number(formatEther(totalPropertyValue)) * 100 + appreciation / Number(formatEther(totalPropertyValue))).toFixed(3) + "%"}
             loading={selectedGraph == 'land' ? isLoading : isRwaLoading}
           />
          </div>
        </div>
      </div>
    </div>
  );
}
