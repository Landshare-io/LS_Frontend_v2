import React, { useRef } from "react";
import numeral from "numeral";
import Image from "next/image";
import Slider from "react-slick";
import ReactModal from "react-modal";
import { useTheme } from "next-themes";
import { yieldUpdgradesData } from "../../../../config/constants/game-data";
import { 
  validateDependency,
  validateItemDate, 
  validateItemDateWithDeadTime
} from "../../../../utils/helpers/validator";
import useGetSetting from "../../../../hooks/nft-game/axios/useGetSetting";
import { BOLD_INTER_TIGHT } from "../../../../config/constants/environments";
import { NextIconYieldIcon, SlickPrevIcon } from "../../icons/index";
import sadEmoji from "../../../../../public/icons/sad_emoji.png";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

interface TotalYieldMultiModalProps {
  house: any,
  modalShow: boolean,
  setModalShow: Function
}

export default function TotalYieldMultiModal({
  house,
  modalShow,
  setModalShow
}: TotalYieldMultiModalProps) {
  const { theme } = useTheme();
  const { oneDayTime } = useGetSetting();
  let addonItems = []
  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflow: "hidden",
      maxWidth: "800px",
      width: "90%",
      height: "fit-content",
      borderRadius: "20px",
      padding: 0,
      border: 0,
      backgroundColor: theme == "dark" ? "#31333b" : "#f6f7f9",
    },
    overlay: {
      background: '#00000080'
    }
  };

  if (house?.yieldUpgrades && house?.yieldUpgrades.length > 0) {
    for (const item of yieldUpdgradesData) {
      const yieldItem = house.yieldUpgrades.filter((yItem: any) => yItem.name == item.title && yItem.specialButtonName == '')[0]
      if (item.title == 'Garden') {
        const gardenItem = house.yieldUpgrades.filter((yItem: any) => yItem.title == item.title && yItem.specialButtonName == '')[0]
        const fertilizeItem = house.yieldUpgrades.filter((yItem: any) => yItem.title == item.title && yItem.specialButtonName == 'FERTILIZE')[0]
  
        if (validateItemDate(gardenItem, oneDayTime)) {
          if (validateItemDate(fertilizeItem, oneDayTime)) {
            addonItems.push({
              ...item,
              ...gardenItem,
              multiplier: Number(gardenItem.buyReward[9]) + Number(fertilizeItem.buyReward[9]),
              type: 'addon'
            })
          } else {
            addonItems.push({
              ...item,
              ...gardenItem,
              multiplier: gardenItem.buyReward[9],
              type: 'addon'
            })
          }
        }
      } else if (item.title == 'Fireplace') {
        if (validateItemDateWithDeadTime(yieldItem) != -1) {
          addonItems.push({
            ...item,
            ...yieldItem,
            multiplier: yieldItem.buyReward[9],
            type: 'addon'
          })
        }
      } else {
        if (validateDependency(house, item.id, yieldItem)) {
          if (validateItemDate(yieldItem, oneDayTime)) {
            addonItems.push({
              ...item,
              ...yieldItem,
              multiplier: yieldItem.buyReward[9],
              type: 'addon'
            })
          }
        }
      }
    }
  }

  const slider = useRef<any>(null);
  const settings = {
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: false,
    dotsClass: "adson-slick-dots slick-thumb",
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 578,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <ReactModal
      style={customModalStyles}
      isOpen={modalShow}
      onRequestClose={() => { setModalShow(!modalShow), document.body.classList.remove('modal-open'); }}
    >
      <div>
        <div className="flex w-full px-3 py-4 items-center justify-between">
          <h3 className="m-0 text-[18px] text-[#000000cc]">Total Annual Yields </h3>
          <h1 className="m-0 text-[32px] sm:text-[36px] font-semibold text-[#61cd81]">x{ numeral(house.multiplier).format("0.[00]").toString()} LAND</h1>
        </div>
        <div className="border-b-[1px] border-[#cccccc]"></div>
      </div>
      <div>
        <div className="relative">
          {addonItems.length > 4 ? (
            <button
              onClick={() => slider?.current?.slickPrev()}
              className="absolute translate-y-[-50%] top-[37%] z-[2] left-[-10px] bg-transparent border-0"
            >
              <SlickPrevIcon />
            </button>
          ) : null}
          {addonItems.length > 4 ? (
            <button
              onClick={() => slider?.current?.slickNext()}
              className="absolute translate-y-[-50%] top-[37%] z-[2] right-[-10px] bg-transparent border-0"
            >
              <NextIconYieldIcon />
            </button>
          ) : null}

          {addonItems.length > 0 ? (
            addonItems.length > 4 ? (
              <div className="py-5 px-2">
                <div className="mx-4 overflow-hidden">
                  <Slider ref={slider} {...settings}>
                    {addonItems.map((showAddonItem, index) => {
                      if (showAddonItem.type === 'addon') {
                        return (
                          <div
                            className="flex flex-col px-2"
                            key={`addon-detail-show-${index}`}
                          >
                            <div className="h-[168px] bg-gradient-to-b from-[#555b8c] to-[#0e45d14a] overflow-hidden rounded-[10px] flex items-center justify-center">
                              <Image className="w-[150px] h-[150px]" src={showAddonItem.imgUrl} alt={showAddonItem.title} />
                            </div>
                            <div className="font-semibold mt-1 text-[1rem]">{showAddonItem.title}</div>
                            <div className="mt-2 font-semibold text-[#61cd81] text-[1.1rem]">
                              {`+ ${Number(showAddonItem.multiplier)} LAND / Year`}
                            </div>
                          </div>
                        )
                      }
                      if (showAddonItem.type === 'premium') {
                        return (
                          <div
                            className="flex flex-col px-2 addon-detail-show"
                            key={`addon-detail-show-${index}`}
                          >
                            <div className="h-[168px] bg-gradient-to-b from-[#555b8c] to-[#0e45d14a] overflow-hidden rounded-[10px] flex items-center justify-center">
                              <Image className="w-[150px] h-[150px]" src={showAddonItem.imgUrl} alt={showAddonItem.title} />
                            </div>
                            <div className="font-semibold mt-1 text-[1rem]">{showAddonItem.title}</div>
                            <div className="mt-2 font-semibold text-[#61cd81] text-[1.1rem]">
                              {`+ ${Number(showAddonItem.multiplier)} LAND / Year`}
                            </div>
                          </div>
                        )
                      }
                    })}
                  </Slider>
                </div>
              </div>
            ) : (
              <div className="py-5 px-2">
                <div className="mx-4 overflow-hidden flex">
                  {addonItems.map((showAddonItem, index) => {
                    if (showAddonItem.type === 'addon') {
                      return (
                        <div
                          className="flex flex-col px-2"
                          key={`addon-detail-show-${index}`}
                        >
                          <div className="h-[168px] bg-gradient-to-b from-[#555b8c] to-[#0e45d14a] overflow-hidden rounded-[10px] flex items-center justify-center">
                            <Image className="w-[150px] h-[150px]" src={showAddonItem.imgUrl} alt={showAddonItem.title} />
                          </div>
                          <div className="font-semibold mt-1 text-[1rem]">{showAddonItem.title}</div>
                          <div className="mt-2 font-semibold text-[#61cd81] text-[1.1rem]">
                            {`+ ${Number(showAddonItem.multiplier)} LAND / Year`}
                          </div>
                        </div>
                      )
                    }
                    if (showAddonItem.type === 'premium') {
                      return (
                        <div
                          className="flex flex-col px-2"
                          key={`addon-detail-show-${index}`}
                        >
                          <div className="h-[168px] bg-gradient-to-b from-[#555b8c] to-[#0e45d14a] overflow-hidden rounded-[10px] flex items-center justify-center">
                            <Image  className="w-[150px] h-[150px]"src={showAddonItem.imgUrl} alt={showAddonItem.title} />
                          </div>
                          <div className="font-semibold mt-1 text-[1rem]">{showAddonItem.title}</div>
                          <div className="mt-2 font-semibold text-[#61cd81] text-[1.1rem]">
                            {`+ ${Number(showAddonItem.multiplier)} LAND / Year`}
                          </div>
                        </div>
                      )
                    }
                  })}
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col w-full h-full min-h-[290px]">
              <Image
                src={sadEmoji}
                alt="Sad Emoji"
                className="absolute translate-x-[-50%] translate-y-[-50%] top-[35%] left-[50%]"
              />
              <span className={`text-[16px] text-black absolute translate-x-[-50%] translate-y-[-50%] bottom-[20%] left-[50%] ${BOLD_INTER_TIGHT.className}`}>
                No Yield Upgrades
              </span>
            </div>
          )}
        </div>
      </div>
    </ReactModal>
  );
};
