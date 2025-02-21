import React from "react";
import { Carousel } from "react-responsive-carousel";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./investment-house-detail.module.css";
import { useGlobalContext } from "../../context/GlobalContext";

interface HouseInfoCarouselComponentProps {
  houseInfo: any
  isLoading: boolean
}

export default function HouseInfoCarouselComponent({ houseInfo, isLoading }: HouseInfoCarouselComponentProps) {
  const { theme } = useGlobalContext();

  return (
    <>
      {houseInfo?.address ? (
        <div className="max-w-[1200px] m-auto my-[10px] px-[10px]">
          <div className="flex flex-col md:flex-row mt-[20px] sm:gap-[40px]">
            <div className="w-full">
              {isLoading ? (
                <SkeletonTheme baseColor={`${theme == 'dark' ? "#31333b" : "#dbdde0"}`} highlightColor={`${theme == 'dark' ? "#52545e" : "#f6f7f9"}`}>
                  <Skeleton className="rounded-lg h-full min-h-[420px] w-full" />
                </SkeletonTheme>
              ) : (
                <div className={styles.carouselContainer}>
                  <Carousel>
                    {houseInfo?.pictures?.map((imgObj: any) =>
                      <div>
                        <img className="rounded-[13px]" src={imgObj} alt="" />
                      </div>
                    )}
                  </Carousel>
                </div>
              )}
            </div>
            <div className="flex flex-col w-full">
              <div className="hidden sm:flex gap-[15px] text-[16px] text-text-secondary">
                <span>Home</span>
                <span>{houseInfo?.address}</span>
              </div>
              <h1 className={`pt-[10px] text-[20px] md:text-[30px] text-text-primary ${BOLD_INTER_TIGHT.className}`}>
                {houseInfo?.address}
              </h1>
              <div className="flex flex-col gap-[10px] text-[16px] tracking-[0.02em] pt-[10px] pb-[5px] text-text-secondary" dangerouslySetInnerHTML={{ __html: houseInfo?.description }}>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
