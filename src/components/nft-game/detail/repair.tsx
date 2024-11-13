import React, { useEffect, useState } from "react";
import InputCost from "../../common/input-cost";
import ReparingCost from "./repairing-cost";
import RepairButton from "./repair-button";
import useHouseRepair from "../../../hooks/nft-game/axios/useHouseRepair";


interface RepairProps {
  house: any;
  setHouse: Function;
}

export default function Repair({
  house,
  setHouse,
}: RepairProps) {
  const [displayPercent, setDisplayPercent] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { repairWithAmount, changeRepairAmount } = useHouseRepair(setIsLoading);

  useEffect(() => {
    calcMaxAmount();
  }, [house.lastDurability, house.maxDurability]);


  const calcMaxAmount = async () => {
    setDisplayPercent(
      house.maxDurability - Number(house.lastDurability)
    );
    changeRepairAmount(house, setHouse, setDisplayPercent, house.maxDurability - Number(house.lastDurability))
  };

  return (
    <>
      <div className="block md:hidden mb-4 w-full">
        <div className={`flex flex-col rounded-r-0 gap-[20px] justify-between py-[1px]`}>
          <div className={`flex justify-between items-center px-[20px] py-1 text-text-primary rounded-[2rem] h-[46px] ${house.isActivated && !house.onSale ? "border-[2px] border-[#61cd81]" : "border-[2px] border-[#8f8f8f]"}`}>
            <span className="mr-2 text-[14px]">Amount: </span>
            <InputCost
              width={70}
              value={displayPercent}
              changeRepairAmount={() => changeRepairAmount(house, setHouse, setDisplayPercent, displayPercent)}
              calcMaxAmount={calcMaxAmount}
            />
          </div>
          <div className={`flex pr-[130px] pl-[20px] w-full h-[46px] relative rounded-[2rem] ${house.isActivated && !house.onSale ? "border-[2px] border-[#61cd81]" : "border-[2px] border-[#8f8f8f]"}`}>
            {isLoading ? <>
              <span className="font-semibold" style={{ marginLeft: "20px" }}>Loading</span></> :
              <ReparingCost
                className="min-w-[316px] gap-[20px]"
                cost={{
                  power: house?.repairCost[0] ?? 0,
                  lumber: house?.repairCost[1] ?? 0,
                  brick: house?.repairCost[2] ?? 0,
                  concrete: house?.repairCost[3] ?? 0,
                  steel: house?.repairCost[4] ?? 0,
                }}
              />}
            <RepairButton
              repair={() => repairWithAmount(house, setHouse, setDisplayPercent, displayPercent)}
              isLoading={isLoading}
              activated={house.isActivated && !house.onSale}
            />
          </div>
        </div>
        {/* <div className="block">
        </div> */}
      </div>
      <div className="hidden md:block mb-3 h-[44px] pr-0 md:pr-[125px] relative">
        <div
          className={`flex-1 px-[0.75rem] rounded-l-[2rem] pr-[1.5rem] h-full flex gap-[30px] justify-between ${house.isActivated && !house.onSale ? "border-[2px] border-[#61cd81] pr-0" : "border-[2px] border-[#8f8f8f] pr-0"}`}
        >
          <div className="flex flex-grow-1 justify-between items-center py-2 mr-3 sm:mr-0 text-text-primary">
            <span className="mr-2 text-[14px]">Amount: </span>
            <InputCost
              width={70}
              value={displayPercent}
              changeRepairAmount={() => changeRepairAmount(house, setHouse, setDisplayPercent, displayPercent)}
              calcMaxAmount={calcMaxAmount}
            />
          </div>
          <div className="hidden md:flex w-full border-l-[1px] border-[#61cd81] rounded-[2rem] pl-[10px]">
            <ReparingCost
              className="min-w-[316px]"
              cost={{
                power: house.repairCost[0],
                lumber: house.repairCost[1],
                brick: house.repairCost[2],
                concrete: house.repairCost[3],
                steel: house.repairCost[4],
              }}
            />
          </div>
        </div>
        <RepairButton
          repair={() => repairWithAmount(house, setHouse, setDisplayPercent, displayPercent)}
          isLoading={isLoading}
          activated={house.isActivated && !house.onSale}
        />
      </div>
    </>
  );
};
