import React from "react";
import Image from "next/image";
import FormCheck from "../../common/form/check";
import numeral from "numeral";
import {
  LumberMainIcon,
  BrickMainIcon,
  ConcreteMainIcon,
  SteelMainIcon,
} from "../../common/icons/nft";
import HarvestCost from "./harvest-cost";

import landTokenStakingImg from "../../../../public/icons/land-token-staking-img.png";
import { useGlobalContext } from "../../../context/GlobalContext";

import useGetUserData from "../../../hooks/nft-game/axios/useGetUserData";
import useGetResource from "../../../hooks/nft-game/axios/useGetResource";

interface HarvestCardsProps {
  item: any;
  type: number;
  colorType: number;
  btnTitle: string;
  selectedResource: boolean[];
  setSelectedResource: Function;
  onPurcharse: Function;
  isLoading: any;
}

export default function HarvestCards({
  item,
  type,
  colorType,
  btnTitle,
  selectedResource,
  setSelectedResource,
  onPurcharse,
  isLoading
}: HarvestCardsProps) {
  const { facilities } = useGetUserData()
  const { userReward } = useGetResource();
  const {
    notifyError,
    theme
  } = useGlobalContext();

  const colors = ["disable", "grey", "yellow", "blue"];
  const resourceActiveIcons = [
    <LumberMainIcon color="black" opacity={1} />,
    <BrickMainIcon color="black" opacity={1} />,
    <ConcreteMainIcon color="black" opacity={1} />,
    <SteelMainIcon color="black" opacity={1} />,
    <Image
      alt="land-token"
      style={{
        height: "84px",
        opacity:
          userReward[4] == 0
            ? "0.1"
            : selectedResource[4]
              ? "1"
              : "0.6",
      }}
      className="harvestable-card-image"
      src={landTokenStakingImg}
    />
  ];
  const resourceIcons = [
    <LumberMainIcon color={theme == "dark" ? "#cbcbcb" : "#000"} opacity={0.6} />,
    <BrickMainIcon color={theme == "dark" ? "#cbcbcb" : "#000"} opacity={0.6} />,
    <ConcreteMainIcon color={theme == "dark" ? "#cbcbcb" : "#000"} opacity={0.6} />,
    <SteelMainIcon color={theme == "dark" ? "#cbcbcb" : "#000"} opacity={0.6} />,
    <Image
      alt="land-token"
      style={{
        height: "84px",
        opacity:
          userReward[4] == 0
            ? "0.1"
            : selectedResource[4]
              ? "1"
              : "0.6",
      }}
      className="harvestable-card-image"
      src={landTokenStakingImg}
    />
  ];
  const resourceDisabledIcons = [
    <LumberMainIcon color={theme == "dark" ? "#cbcbcb" : "#000"} opacity={0.1} />,
    <BrickMainIcon color={theme == "dark" ? "#cbcbcb" : "#000"} opacity={0.1} />,
    <ConcreteMainIcon color={theme == "dark" ? "#cbcbcb" : "#000"} opacity={0.1} />,
    <SteelMainIcon color={theme == "dark" ? "#cbcbcb" : "#000"} opacity={0.1} />,
    <Image
      alt="land-token"
      style={{
        height: "84px",
        opacity:
          userReward[4] == 0
            ? "0.1"
            : selectedResource[4]
              ? "1"
              : "0.6",
      }}
      className="harvestable-card-image"
      src={landTokenStakingImg}
    />
  ];

  const harvestSelect = (type: number) => {
    if (type == 4 && parseFloat(userReward[type].toString()) < 0.1) {
      return notifyError("Minimum Token Harvest amount is 0.1");
    }
    if (
      type != 4 &&
      ((facilities[type + 1]?.currentFacility?.level ?? 0) < 1) ||
        parseFloat(userReward[type].toString()) < 0.00001
    )
      return;
    setSelectedResource((prevState: any) => [
      ...prevState.slice(0, type),
      !prevState[type],
      ...prevState.slice(type + 1),
    ]);
  };
  return (
    <div className="min-w-[200px] mb-[20px] border-[1px] border-[#00000033] pt-[17px] bg-gradient-to-b from-[#9e9e9e33] to-[#d9d9d933] duration-300 hovershadow-md">
      <div className="pl-[10px] cursor-pointer">
        <FormCheck
          type="checkbox"
          id={`checkbox-${type}`}
          label={item.name}
          className="custom-checkbox"
          checked={selectedResource[type]}
          disabled={
            (item.name == 'Harvest Token' ?
              parseFloat(userReward[type].toString()) < 0.1 :
              ((facilities[type + 1]?.currentFacility?.level ?? 0) < 1 ||
                parseFloat(userReward[type].toString()) < 0.00001))
          }
          onChange={(e: any) => {
            setSelectedResource((prevState: any) => [
              ...prevState.slice(0, type),
              e.target.checked,
              ...prevState.slice(type + 1),

            ]);
          }}
        />
        <div
          className={`text-[16px] font-semibold ${theme == "dark" ? "text-gray-300" : "text-black-700"} pl-4 cursor-pointer ${item.name == 'Harvest Token' ? 'mt-[24px]' : ''}`}
          onClick={() => harvestSelect(type)}
        >
          {
            item.name == 'Harvest Token' ?
              '  ' :
              ((facilities[type + 1].currentFacility?.level ?? 0) < 1 ? "Not Available yet" :
                `Level ${facilities[type + 1].currentFacility?.level}`)
          }
        </div>
      </div>
      <div
        className="w-full h-[130px] flex justify-center relative cursor-pointer"
        onClick={() => harvestSelect(type)}
      >
        {item.name == 'Harvest Token' ?
          resourceActiveIcons[type] : (
            facilities[type + 1].currentFacility?.level > 0
              ? selectedResource[type]
                ? resourceActiveIcons[type]
                : resourceIcons[type]
              : resourceDisabledIcons[type]
          )}
        <div className="absolute translate-x-[-50%] bottom-[10px] left-[50%] text-[16px] font-semibold text-text-secondary">
          {numeral(Number(isNaN(userReward[type]) ? 0 : userReward[type]))
            .format("0.[0000000]")}
        </div>
      </div>
      <div className="px-[5px] pb-[5px] relative">
        <HarvestCost 
          color={colors[colorType]}
          btnLabel={btnTitle}
          onPurcharse={onPurcharse}
          isLoading={isLoading}
          type={item.id}
          item={item}
          colorType={colorType}
        />
      </div>
    </div>
  );
};
