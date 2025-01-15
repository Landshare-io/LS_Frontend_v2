import React, { useState } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { Carousel } from "react-responsive-carousel";
import YieldUpgrade from "./yield-upgrade";
import FireplaceUpgrade from "./fireplace-upgrade";
import HireHandymanUpgrade from "./hirehandyman-upgrade";
import { productionUpgradesData } from "../../../config/constants/game-data";
import { 
  validateItemDate,
  getItemDuration
} from "../../../utils/helpers/validator";
import useProductionUpgrade from "../../../hooks/nft-game/axios/useProductionUpgrade";
import useGetUserData from "../../../hooks/nft-game/axios/useGetUserData";
import useGetSetting from "../../../hooks/nft-game/axios/useGetSetting";
import carouselIcon from "../../../../public/icons/carousel-icon.png";
import "react-responsive-carousel/lib/styles/carousel.min.css";


interface ProductionUpdgradeProps {
  house: any
  setHouse: Function
}

export default function ProductionUpgrade ({
  house,
  setHouse,
}: ProductionUpdgradeProps) {
  const { address } = useAccount()
  const { userData } = useGetUserData()
  const { oneDayTime } = useGetSetting()

  const isOwn = house?.userId == userData?.id;
  const [toolshedIndex, setToolshedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState({ type: -1, loading: false });
  const hasFireplace = house.productionUpgrades.filter((pItem: any) => pItem.name == "Firepit" && pItem.specialButtonName == "")[0].activeTime
  const hasConcreteFoundation = 
    validateItemDate(house.productionUpgrades.filter((pItem: any) => pItem.name == "Concrete Foundation" && pItem.specialButtonName == '')[0], oneDayTime) ||
    validateItemDate(house.productionUpgrades.filter((pItem: any) => pItem.name == "Concrete Foundation" && pItem.specialButtonName == 'REPAIR')[0], oneDayTime)
  const hasGenerator = house.productionUpgrades.filter((pItem: any) => pItem.name == "Generator")[0].activeTime
  const hasHarvester = house.productionUpgrades.filter((pItem: any) => pItem.name == "Harvester")[0].activeTime
  const handleToolshedSelect = (selectedIndex: number) => {
    setToolshedIndex(selectedIndex);
  };

  const {
    burnLumber,
    buyToolshed,
    switchToolshed,
    hireHandymanAction,
    buyProductionItem,
    repairConcreteFoundation,
    buyProductionOfUser
  } = useProductionUpgrade(house, setHouse, address, setIsLoading)

  return (
    <div className="max-w-[1200px] px-0 my-5">
      <div className="flex flex-col md:grid md:grid-cols-[minmax(257px,max-content),minmax(257px,max-content)] justify-between gap-[45px] mlg:md:grid-cols-[minmax(257px,max-content),minmax(257px,max-content),minmax(257px,max-content)] lg:md:grid-cols-[minmax(257px,max-content),minmax(257px,max-content),minmax(257px,max-content),minmax(257px,max-content)]">
        <div className="relative flex justify-center toolshed-carousel w-[257px] mr-[10px] sm:mr-[40px]">
          <span
            onClick={() =>
              handleToolshedSelect(toolshedIndex > 0 ? toolshedIndex - 1 : 0)
            }
            className="flex w-[25px] h-[25px] bg-[#FFFFFF] rounded-[50%] shadow-md z-[15] top-[138px] cursor-pointer left-[-5px] absolute justify-center items-center"
          >
            <Image src={carouselIcon} alt="Carousel prev icon" />
          </span>
          <Carousel
            width={257}
            showIndicators={false}
            showStatus={false}
            showThumbs={false}
            showArrows={false}
            selectedItem={toolshedIndex}
          >
            {productionUpgradesData.filter((item: any) => item.sortingId === 0).map((item: any, index: number) => {
              const toolshed = {
                ...item,
                ...house.productionUpgrades.filter((pItem: any) => pItem.name == item.title)[0],
                type: 'toolshed'
              };
              let btnTitle = house.activeToolshedType === toolshed.id ? "OWNED" : "BUY";
              let colorType = house.activeToolshedType === toolshed.id ? 3 : 1;
              if (
                toolshed.activeTime &&
                house.activeToolshedType != toolshed.id
              ) {
                btnTitle = "SWITCH";
                colorType = 2;
              }

              if (house.onSale || !house.isActivated || !isOwn) colorType = 0;

              return (
                <YieldUpgrade
                  key={`yield-upgrade-${index}`}
                  item={toolshed}
                  colorType={colorType}
                  type="production"
                  btnTitle={btnTitle}
                  onPurcharse={() =>
                    btnTitle === "BUY"
                      ? buyToolshed(toolshed)
                      : switchToolshed(toolshed)
                  }
                  disabled={house.onSale || btnTitle === "OWNED" || !house.isActivated || !isOwn}
                  isLoading={isLoading}
                />
              );
            })}
          </Carousel>
          <span
            onClick={() =>
              handleToolshedSelect(toolshedIndex < 3 ? toolshedIndex + 1 : 3)
            }
            className="flex w-[25px] h-[25px] bg-[#FFFFFF] rounded-[50%] shadow-md z-[15] top-[138px] cursor-pointer right-[-5px] absolute justify-center items-center rotate-180"
          >
            <Image src={carouselIcon} alt="Carousel next icon" />
          </span>
        </div>
        <div className="w-[257px] mr-[10px] sm:mr-[40px]">
          <FireplaceUpgrade
            item={{
              ...productionUpgradesData.filter((item: any) => item.title == "Firepit")[0],
              ...(
                hasFireplace ? 
                  house.productionUpgrades.filter((pItem: any) => pItem.name == "Firepit" && pItem.specialButtonName == 'BURN')[0] :
                  house.productionUpgrades.filter((pItem: any) => pItem.name == "Firepit" && pItem.specialButtonName == '')[0] 
              )
            }}
            colorType={!house.onSale && house.isActivated && isOwn ? (hasFireplace ? 2 : 1) : 0}
            btnTitle={hasFireplace ? "BURN" : "BUY"}
            onPurcharse={(lumber: number) =>
              hasFireplace ? 
                burnLumber(lumber, house.productionUpgrades.filter((pItem: any) => pItem.name == "Firepit" && pItem.specialButtonName == 'BURN')[0], oneDayTime) : 
                buyProductionOfUser(house.productionUpgrades.filter((pItem: any) => pItem.name == "Firepit" && pItem.specialButtonName == '')[0], oneDayTime)
            }
            disabled={house.onSale || !house.isActivated || !isOwn}
            type="production"
            isLoading={isLoading}
          />
        </div>
        <div className="w-[257px] mr-[10px] sm:mr-[40px]">
          <YieldUpgrade
            item={{
              ...productionUpgradesData.filter((item: any) => item.title == "Concrete Foundation")[0],
              ...(
                hasConcreteFoundation ? 
                  house.productionUpgrades.filter((pItem: any) => pItem.name == "Concrete Foundation" && pItem.specialButtonName == 'REPAIR')[0] :
                  house.productionUpgrades.filter((pItem: any) => pItem.name == "Concrete Foundation" && pItem.specialButtonName == '')[0]
              ),
              type: 'concreteFoundation'
            }}
            colorType={!house.onSale && house.isActivated && isOwn ? (hasConcreteFoundation ? 2 : 1) : 0}
            btnTitle={hasConcreteFoundation ? 'REPAIR' : 'BUY'}
            onPurcharse={() => repairConcreteFoundation(
                house.productionUpgrades.filter((pItem: any) => pItem.name == "Concrete Foundation" && pItem.specialButtonName == '')[0],
                house.productionUpgrades.filter((pItem: any) => pItem.name == "Concrete Foundation" && pItem.specialButtonName == 'REPAIR')[0],
                oneDayTime
              )
            }
            disabled={house.onSale || !house.isActivated || !isOwn}
            type="production"
            isLoading={isLoading}
          />
        </div>
        <div className="w-[257px] mr-[10px] sm:mr-[40px]">
          <YieldUpgrade
            item={{
              ...productionUpgradesData.filter((item: any) => item.title == "Harvester")[0],
              ...house.productionUpgrades.filter((pItem: any) => pItem.name == "Harvester")[0],
              type: 'harvester'
            }}
            colorType={!house.onSale && house.isActivated && isOwn ? (hasHarvester ? 3 : 1) : 0}
            btnTitle={hasHarvester ? "OWNED" : "BUY"}
            onPurcharse={() => buyProductionOfUser({
              ...productionUpgradesData.filter((item: any) => item.title == "Harvester")[0],
              ...house.productionUpgrades.filter((pItem: any) => pItem.name == "Harvester")[0],
              type: 'harvester'
            }, oneDayTime)}
            disabled={house.onSale || hasHarvester || !house.isActivated || !isOwn}
            type="production"
            isLoading={isLoading}
          />
        </div>
        {productionUpgradesData.filter((item: any) => item.sortingId === 4).map((fort: any, index: number) => {
          const item = {
            ...fort,
            ...house.productionUpgrades.filter((pItem: any) => pItem.name == fort.title)[0],
            type: 'fatification'
          };

          let btnTitle = "BUY";
          let durationDate = item.buy[10];
          let colorType = 1;
          if (validateItemDate(house.productionUpgrades.filter((pItem: any) => pItem.name == item.title)[0], oneDayTime)) {
            btnTitle = "OWNED";
            durationDate = getItemDuration(house.productionUpgrades.filter((pItem: any) => pItem.name == item.title)[0], oneDayTime)
            if (durationDate === 0) durationDate = 0.5;
            colorType = 3;
          }

          if (house.onSale || !house.isActivated || !isOwn) colorType = 0;

          return (
            <div
              key={`production-upgrade-${index}`}
              className="w-[257px] mr-[10px] sm:mr-[40px]"
            >
              <YieldUpgrade
                item={item}
                colorType={colorType}
                btnTitle={btnTitle}
                onPurcharse={btnTitle === "OWNED" ? () => {} : () => buyProductionItem(item, oneDayTime)}
                disabled={house.onSale || btnTitle === "OWNED" || !house.isActivated || !isOwn}
                type="production"
                isLoading={isLoading}
              />
            </div>
          );
        })}
        <div className="w-[257px] mr-[10px] sm:mr-[40px]">
          <HireHandymanUpgrade
            item={{
              ...productionUpgradesData.filter((item: any) => item.title == "Hire Handyman")[0],
              ...house.productionUpgrades.filter((pItem: any) => pItem.name == "Hire Handyman")[0],
            }}
            colorType={
              !house.onSale && house.isActivated && isOwn
                ? validateItemDate(house.productionUpgrades.filter((pItem: any) => pItem.name == "Hire Handyman")[0], oneDayTime)
                  ? 3
                  : 1
                : 0
            }
            btnTitle={
              validateItemDate(house.productionUpgrades.filter((pItem: any) => pItem.name == "Hire Handyman")[0], oneDayTime)
                ? "ON COOLDOWN"
                : "BUY"
            }
            onPurcharse={() => hireHandymanAction({
              ...productionUpgradesData.filter((item: any) => item.title == "Hire Handyman")[0],
              ...house.productionUpgrades.filter((pItem: any) => pItem.name == "Hire Handyman")[0],
            }, isOwn, oneDayTime)}
            disabled={
              house.onSale ||
              !house.isActivated ||
              !isOwn ||
              (validateItemDate(house.productionUpgrades.filter((pItem: any) => pItem.name == "Hire Handyman")[0], oneDayTime)
                ? true
                : false) ||
              house.currentDurability == 100
            }
            type="production"
            houseMaxDurability={house.maxDurability}
            houseDurability={house.currentDurability}
            duration={Math.floor(
              (Number(Date.parse(house.productionUpgrades.filter((pItem: any) => pItem.name == "Hire Handyman")[0])) - Date.now())
            )}
            isLoading={isLoading}
          />
        </div>
        <div className="w-[257px] mr-[10px] sm:mr-[40px]">
          <YieldUpgrade
            item={{
              ...productionUpgradesData.filter((item: any) => item.title == "Generator")[0],
              ...(
                  house.productionUpgrades.filter((pItem: any) => pItem.name == "Generator" && pItem.specialButtonName == '')[0]
              ),
              type: 'Generator'
            }}
            colorType={!house.onSale && house.isActivated && isOwn ? (hasGenerator ? 3 : 1) : 0}
            btnTitle={hasGenerator ? 'OWN' : 'BUY'}
            onPurcharse={hasGenerator ? () => {} : () => buyProductionItem({
              ...productionUpgradesData.filter((item: any) => item.title == "Generator")[0],
              ...house.productionUpgrades.filter((pItem: any) => pItem.name == "Generator")[0],
              type: "Generator"
            }, oneDayTime)}
            disabled={house.onSale || !house.isActivated || !isOwn}
            type="production"
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
