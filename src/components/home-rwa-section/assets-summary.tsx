import { useState } from "react";
import { Inter_Tight } from "next/font/google";
import FeatureBadge from "../common/feature-badge";
import ToggleButton from "../common/toggle-button";
import Carousel from "../common/carousel";
import CarouselControl from "../common/carousel/carousel-control";


const boldInterTight = Inter_Tight({
  weight: "700",
  style: "normal",
  preload: false,
});

export default function HomeRwaAssetsSummary() {
  const [selectedGraph, setSelectedGraph] = useState('rwa')
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false);

  return (
    <div className="pt-[30px] pb-[40px] px-0 md:pl-0 md:pr-0 lg:py-[80px] lg:px-[120px] bg-secondary">
      <div className="flex flex-col items-start md:flex-row justify-between md:items-center gap-[10px] xl:gap-[20px] 2xl:gap-[100px] pt-[100px] pr-0 max-w-[1200px] m-auto">
        <div className="flex flex-col items-start w-full gap-0">
          <div className="px-[10px] md:px-[40px]">
            <FeatureBadge
              icon="/icons/wallet.svg"
              text="Real World Assets"
              type="gray"
            />
            <h1 className={`text-text-primary text-[40px] leading-[50px] md:text-[54px] md:leading-[68px] md:my-[12px] md:mx-0 text-center md:text-start ${boldInterTight.className}`}>Asset Summary</h1>
          </div>
          <div className="latest-group">
            <div className="px-[10px] md:px-[40px]">
              <div className="latest-properties-button-group">
                <ToggleButton
                  onClick={() => setSelectedGraph('rwa')}
                  active={selectedGraph == 'rwa'}
                  className="w-[122px] h-[32px]"
                >
                  RWA Value
                </ToggleButton>
                <ToggleButton
                  onClick={() => setSelectedGraph('land')}
                  active={selectedGraph == 'land'}
                  className="w-[122px] h-[32px]"
                >
                  LAND Price
                </ToggleButton>

              </div>
              <div className="latest-properties-graph-setion">
                <div className="bg-primary latest-properties-graph">
                  {/* <PriceGraph type={selectedGraph} landPrice={Number.parseFloat(landPrice).toFixed(5)} isDataLoading={landDataLoading} isRWAPage={false} /> */}
                </div>
              </div>
            </div>
            <div className="hidden mlg:w-[430px] mlg:mt-[56px] mlg:block mlg:overflow-visible">
              <CarouselControl
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                count={propertiesRental.length}
                paused={paused}
                carouselControlClass="mb-[20px] px-[10px] md:px-[40px]"
              />
              <div className="latest-property-carousel-container">
                <Carousel
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                  setPaused={setPaused}
                >
                  {propertiesRental.map((property, i) => {
                    const tmp = {
                      ...property,
                      type: "Rental Property",
                      preview: PROPERTIES[0].preview
                    }
                    return (
                      <CarouselItem key={i} width="fit-content">
                        <PropertyCard property={tmp} />
                      </CarouselItem>
                    );
                  })}
                </Carousel>
              </div>
            </div>
          </div>
          {isMobile && (
            <div className="financial-summary-properties latest-properties-financial-summary pr-0 lg:pr-[450px] overflow-hidden">
              <div className="financial-summary-properties-carousel">
                <div className="financial-summary-properties-container">
                  <Carousel
                    activeIndex={summaryActiveIndex}
                    setActiveIndex={setSummaryActiveIndex}
                  >
                    <CarouselItem width="fit-content">
                      <FinancialPropertyCard
                        title={selectedGraph == 'land' ? "Market Cap" : "Rental Yield"}
                        value={selectedGraph == 'land' ? "$" + marketcap?.toLocaleString() : (netRentalPerMonth * 12 / totalPropertyValue * 100).toFixed(3) + "%"}
                        loading={selectedGraph == 'land' ? landDataLoading : rwaDataLoading}
                      />
                    </CarouselItem>
                    <CarouselItem width="fit-content">
                      <FinancialPropertyCard
                        title={selectedGraph == 'land' ? "Circulating Supply" : "Est. Appreciation"}
                        value={selectedGraph == 'land' ? circulatingSupply?.toLocaleString() : (appreciation / totalPropertyValue).toFixed(3) + "%"}
                        loading={selectedGraph == 'land' ? landDataLoading : rwaDataLoading}
                      />
                    </CarouselItem>
                    <CarouselItem width="fit-content">
                      <FinancialPropertyCard
                        title={selectedGraph == 'land' ? "Current Price" : "Ann. Return"}
                        value={selectedGraph == 'land' ? Number.parseFloat(landPrice).toFixed(3) : (netRentalPerMonth * 12 / totalPropertyValue * 100 + appreciation / totalPropertyValue).toFixed(3) + "%"}
                        loading={selectedGraph == 'land' ? "$" + landDataLoading : rwaDataLoading}
                      />
                    </CarouselItem>
                  </Carousel>
                </div>
                <CarouselControlMobile
                  isIndicator={true}
                  isControl={true}
                  activeIndex={summaryActiveIndex}
                  setActiveIndex={setSummaryActiveIndex}
                  count={3}
                  isSmallControl={true}
                  style={{
                    margin: '0 0 20px 0',
                  }}
                  carouselControlClass="px-[10px] md:px-[40px] limited-width"
                />
              </div>
            </div>
          )}
          {!isMobile && (
            <div className="financial-summary-properties latest-properties-financial-summary pr-0 lg:pr-[450px] overflow-visible">
              <FinancialPropertyCard
                title={selectedGraph == 'land' ? "Market Cap" : "Rental Yield"}
                value={selectedGraph == 'land' ? "$" + marketcap?.toLocaleString() : (netRentalPerMonth * 12 / totalPropertyValue * 100).toFixed(3) + "%"}
                loading={selectedGraph == 'land' ? landDataLoading : rwaDataLoading}
              />
              <FinancialPropertyCard
                title={selectedGraph == 'land' ? "Circulating Supply" : "Est. Appreciation"}
                value={selectedGraph == 'land' ? circulatingSupply?.toLocaleString() : (appreciation / totalPropertyValue).toFixed(3) + "%"}
                loading={selectedGraph == 'land' ? landDataLoading : rwaDataLoading}
              />
              <FinancialPropertyCard
                title={selectedGraph == 'land' ? "Current Price" : "Ann. Return"}
                value={selectedGraph == 'land' ? "$" + Number.parseFloat(landPrice).toFixed(3) : (netRentalPerMonth * 12 / totalPropertyValue * 100 + appreciation / totalPropertyValue).toFixed(3) + "%"}
                loading={selectedGraph == 'land' ? landDataLoading : rwaDataLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
