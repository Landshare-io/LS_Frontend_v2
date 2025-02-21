import React from "react";
import {
  BrickIcon,
  ChargeIcon,
  ConcreteIcon,
  LumberIcon,
  SteelIcon,
} from "../../common/icons/nft";
import { useGlobalContext } from "../../../context/GlobalContext";
import { BOLD_INTER_TIGHT } from "../../../config/constants/environments";

export default function ReparingCostList({ cost }: { cost: any }) {
  const { theme } = useGlobalContext();
  const icons = {
    'power': <ChargeIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#000000"} />,
    'lumber': <LumberIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#000000"} />,
    'brick': <BrickIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#000000"} />,
    'concrete': <ConcreteIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#000000"} />,
    'steel': <SteelIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#000000"} />,
  } as Record<string, any>;
  return (
    <>
      {Object.keys(cost).map((key: string) => (
        <div
          key={key}
          className="flex justify-center p-1 items-center text-[14px] text-text-secondary"
        >
          <span className={`pr-[2px] ${BOLD_INTER_TIGHT.className}`}>{Math.ceil(cost[key] * 10) / 10}</span>
          {icons[key]}
        </div>
      ))}
    </>
  );
};
