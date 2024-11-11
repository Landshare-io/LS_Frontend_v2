import { useState } from "react";
import Image from "next/image";
import numeral from "numeral";
import ReactLoading from "react-loading";
import { useRouter } from "next/router";
import Button from "../../common/button";
import ReparingStatus from "../reparing-status";
import HouseNft from "../../../../public/img/house/house_big.bmp";
import HouseRareNft from "../../../../public/img/house/house_rare_big.bmp";
import HouseLandNft from "../../../../public/img/house/house_land_big.bmp";
import HouseLandRareNft from "../../../../public/img/house/house_land_rare_big.bmp";
import HouseGardenNft from "../../../../public/img/house/house_garden_big.bmp";
import HouseGardenRareNft from "../../../../public/img/house/house_garden_rare_big.bmp";
import HouseBNft from "../../../../public/img/house/houseB.bmp";
import HouseBRareNft from "../../../../public/img/house/houseB_rare.bmp";
import HouseBLandNft from "../../../../public/img/house/houseB_land.bmp";
import HouseBLandRareNft from "../../../../public/img/house/houseB_land_rare.bmp";
import HouseBGardenNft from "../../../../public/img/house/houseB_garden.bmp";
import HouseBGardenRareNft from "../../../../public/img/house/houseB_garden_rare.bmp";
import HouseCNft from "../../../../public/img/house/houseC.bmp"
import HouseCRareNft from "../../../../public/img/house/houseC_rare.bmp"
import { HammerIcon } from "../../common/icons/nft";
import useHouseActivate from "../../../hooks/nft-game/axios/useHouseActivate";
import useHouseRepair from "../../../hooks/nft-game/axios/useHouseRepair";
import useCheckHasLandscaping from "../../../hooks/nft-game/axios/useCheckHasLandscaping";
import useCheckHasGarden from "../../../hooks/nft-game/axios/useCheckHasGarden";
import { BOLD_INTER_TIGHT } from "../../../config/constants/environments";

interface NftItemProps {
  house: any;
}

export default function NftItem({ house }: NftItemProps) {
  const [isActivating, setIsActivating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const { activate } = useHouseActivate(setIsActivating)
  const { repair } = useHouseRepair(setIsLoading)
  const { hasLandscaping } = useCheckHasLandscaping(house.id)
  const { hasGarden } = useCheckHasGarden(house.id)

  const getHouseImageUrl = () => {
    if (house) {
      if (house.isRare) {
        if (house.isActivated && (hasLandscaping)) {
          if (hasGarden) {
            return (house.type == 1 || house.type == 2)
              ? HouseGardenRareNft
              : (house.type == 3 || house.type == 4) ? HouseBGardenRareNft : HouseCRareNft;
          } else {
            return (house.type == 1 || house.type == 2)
              ? HouseLandRareNft
              : (house.type == 3 || house.type == 4) ? HouseBLandRareNft : HouseCRareNft;
          }
        } else {
          return (house.type == 1 || house.type == 2) ? HouseRareNft : (house.type == 3 || house.type == 4) ? HouseBRareNft : HouseCRareNft;
        }
      } else {
        if (house.isActivated && (hasLandscaping)) {
          if (hasGarden) {
            return (house.type == 1 || house.type == 2) ? HouseGardenNft : (house.type == 3 || house.type == 4) ? HouseBGardenNft : HouseCNft;
          } else {
            return (house.type == 1 || house.type == 2) ? HouseLandNft : (house.type == 3 || house.type == 4) ? HouseBLandNft : HouseCNft;
          }
        } else {
          return (house.type == 1 || house.type == 2) ? HouseNft : (house.type == 3 || house.type == 4) ? HouseBNft : HouseCNft;
        }
      }
    }
    return (house.type == 1 || house.type == 2) ? HouseNft : (house.type == 3 || house.type == 4) ? HouseBNft : HouseCNft;
  };

  return (
    <div className="font-inter rounded-[16px] overflow-hidden w-[251px] duration-300 animate-[fadeIn] flex flex-col m-auto">
      <div className="h-[249px] w-full relative overflow-hidden">
        <div className={`bg-[#c4c4c433] text-[#fff] rounded-[16px] w-full absolute top-0 text-center p-2 ${BOLD_INTER_TIGHT.className}`}>
          {house.name.length > 10
            ? `${house.name.slice(0, 10)}... ${house.isRare
              ? `Rare #${Number(house.typeId) + 1}`
              : `#${Number(house.typeId) + 1}`
            }`
            : `${house.name} ${house.isRare
              ? `Rare #${Number(house.typeId) + 1}`
              : `#${Number(house.typeId) + 1}`
            }`}
        </div>
        <Image
          className="w-[251px] h-[249px]"
          src={getHouseImageUrl()}
          alt="nft-house-image"
        />
        <div className="flex items-end absolute w-full justify-between px-[10px] bottom-[10px]">
          <div>
            <span className="font-inter text-[#fff] text-[14px] font-semibold aline-text-bottom leading-[18px]">
              x
              {numeral(house.multiplier)
                .format("0.[0]")
                .toString()}
            </span>
            <span className="font-inter text-[#fff] text-[10px] pl-[2px] align-text-bottom font-semibold">LAND &nbsp;Yield/Year</span>
          </div>
        </div>
        {house.onSale && 
          <h4 
            className={`bg-[#ec9821] text-[#fff] absolute top-0 right-0 translate-x-[30%] translate-y-0 rotate-45 origin-top-right text-[14px] py-[5px] before:content-[''] before:absolute before:top-0 before:my-0 before:mx-[-1px] before:w-full before:h-full before:bg-[#ec9821] after:content-[''] after:absolute after:top-0 after:my-0 after:mx-[-1px] after:w-full after:h-full after:bg-[#ec9821] ${BOLD_INTER_TIGHT.className}`}
          >
            On Sale
          </h4>
        }
      </div>
      <div className="bg-[#6f8e9d66] p-[12px] flex flex-col">
        <div>
          <div className="flex justify-between items-center pb-2">
            <div className="w-full text-[15px] font-semibold flex justify-between items-center pr-1 dark:text-text-primary">
              <span className="text-[#0b6c96] text-[14px] font-semibold dark:text-text-primary">Durability</span>
              <div
                onClick={() => {
                  if (isLoading) return;
                  repair(house);
                }}
              >
                <HammerIcon className="cursor-pointer w-[17px] duration-300" color="#4c575d" />
              </div>
            </div>
            <ReparingStatus
              max={house.maxDurability}
              now={house.lastDurability}
            />
          </div>
          <div className="flex justify-between items-end pr-2 pb-1">
            <div className="text-[#0b6c96] text-[14px] font-semibold dark:text-text-primary">
              Land Remaining:
            </div>
            <div className="text-[14px] font-semibold text-[#00000080] dark:text-text-primary">{`${numeral(
              Number(house.tokenHarvestLimit) +
              Number(house.extendedBalance) -
              Number(house.tokenReward) -
              Number(house.totalHarvestedToken)).format("0.[00]")} LAND`}</div>
          </div>
        </div>
        <div className="m-auto d-flex justify-content-center pt-2">
          {house.isActivated ? (
            <Button
              className="w-[131px] h-[40px] text-[16px] rounded-[100px] font-semibold cursor-pointer text-button-text-secondary rounded-[20px]"
              onClick={() => router.push(`/nft/${house.id}`)}
            >
              MANAGE
            </Button>
          ) : (
            <Button
              className={`w-[131px] h-[40px] text-[16px] font-semibold cursor-pointer rounded-[20px] text-button-text-secondary ${isActivating
                ? "flex justify-center items-center"
                : ""
                }`}
              onClick={() => activate(house)}
              disabled={isActivating || house.onSale}
            >
              {isActivating ? (
                <>
                  <ReactLoading
                    type="spin"
                    className="mr-2 mb-[4px]"
                    width="24px"
                    height="24px"
                  />
                  <span className="font-semibold">Loading</span>
                </>
              ) : (
                "Activate"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
