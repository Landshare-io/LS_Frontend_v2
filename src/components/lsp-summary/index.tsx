import React, { useState } from "react";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import CarouselControl from "../common/carousel/carousel-control";
import CarouselItem from "../common/carousel/carousel-item";
import CommonCarousel from "../common/carousel";

const Card = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showThumbs, setShowThumbs] = useState(false);

  return (
    <>
      <div className="block md:hidden">
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
            <div className="bg-secondary flex flex-col items-center rounded-3xl p-6 border-text-third/40 dark:border-white/20 border-[1px] shadow-md w-full justify-center">
              <p className="text-[14px] leading-[22px] tracking-[0.02em] text-left pt-[4px] text-text-secondary">
                Tasks Completed
              </p>
              <p
                className={`flex justify-between items-center text-[24px] leading-[30px]  ${BOLD_INTER_TIGHT.className}`}
              >
                5
              </p>
            </div>
          </CarouselItem>

          <CarouselItem
            variant="allowShadow"
            activeIndex={activeIndex}
            containerClassName="w-fit"
          >
            <div className="bg-secondary flex flex-col items-center rounded-3xl p-6 border-text-third/40 dark:border-white/20 border-[1px] shadow-md w-full justify-center">
              <p className="text-[14px] leading-[22px] tracking-[0.02em] text-left pt-[4px] text-text-secondary">
                Tasks Remaining
              </p>
              <p
                className={`flex justify-between items-center text-[24px] leading-[30px]  ${BOLD_INTER_TIGHT.className}`}
              >
                52
              </p>
            </div>
          </CarouselItem>

          <CarouselItem
            variant="allowShadow"
            activeIndex={activeIndex}
            containerClassName="w-fit"
          >
            <div className="bg-secondary flex flex-col items-center rounded-3xl p-6 border-text-third/40 dark:border-white/20 border-[1px] shadow-md  w-full justify-center">
              <p className="text-[14px] leading-[22px] tracking-[0.02em] text-left pt-[4px] text-text-secondary">
                Epoch End Date
              </p>
              <p
                className={`flex justify-between items-center text-[24px] leading-[30px]  ${BOLD_INTER_TIGHT.className}`}
              >
                Dec 8th 2025
              </p>
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
      </div>
      <div className="hidden md:flex items-center justify-around w-full h-full p-3 bg-secondary dark:border-white/20 border-text-third/40 border-[1px] rounded-xl shadow-md">
        <div className="flex flex-col items-center">
          <p className="text-[14px] leading-[22px] tracking-[0.02em] text-left pt-[4px] text-text-secondary">
            Tasks Completed
          </p>
          <p
            className={`flex justify-between items-center text-[24px] leading-[30px]  ${BOLD_INTER_TIGHT.className}`}
          >
            5
          </p>
        </div>
        <div className="border-l border-gray-300 h-16"></div>
        <div className="flex flex-col items-center">
          <p className="text-[14px] leading-[22px] tracking-[0.02em] text-left pt-[4px] text-text-secondary">
            Tasks Remaining
          </p>

          <p
            className={`flex justify-between items-center text-[24px] leading-[30px] ${BOLD_INTER_TIGHT.className}`}
          >
            75
          </p>
        </div>
        <div className="border-l border-gray-300 h-16"></div>
        <div className="flex flex-col items-center">
          <p className="text-[14px] leading-[22px] tracking-[0.02em] text-left pt-[4px] text-text-secondary">
            Epoch End Date
          </p>
          <p
            className={`flex justify-between items-center text-[24px] leading-[30px]  ${BOLD_INTER_TIGHT.className}`}
          >
            Dec 8th 2025
          </p>
        </div>
      </div>
    </>
  );
};

export default Card;
