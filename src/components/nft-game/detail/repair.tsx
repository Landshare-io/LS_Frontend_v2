import React, { useEffect, useState } from "react";

import InputCost from "../../common/input-cost";
import ReparingCost from "./repairing-cost";
import RepairButton from "./repair-button";

import useHouseRepair from "../../../hooks/nft-game/axios/useHouseRepair";
import "./Reparing.css";

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
      <div className="input-group mb-4 reparing-section position-relative">
        <div
          className={`main-reparing-cost d-flex justify-content-between py-[1px] main-reparing-cost-${house.isActivated && !house.onSale ? "allow" : "disable"
            }`}
        >
          <div className="d-flex flex-grow-1 justify-content-between align-items-center py-1 me-sm-3 me-0 text-tw-text-primary">
            <span className="me-2 fs-14 ">Amount: </span>
            <InputCost
              width={70}
              value={displayPercent}
              changeRepairAmount={() => changeRepairAmount(house, setHouse, setDisplayPercent, displayPercent)}
              calcMaxAmount={calcMaxAmount}
            />
          </div>
          <div
            className={`d-none d-sm-flex repair-cost w-100 repair-cost-${house.isActivated && !house.onSale ? "allow" : "disable"
              }`}
          >
            {isLoading ? <>
              <span className="upgrade-status" style={{ marginLeft: "20px" }}>Loading</span></> :
              <ReparingCost
                className="min-w-[316px]"
                cost={{
                  power: house?.repairCost[0] ?? 0,
                  lumber: house?.repairCost[1] ?? 0,
                  brick: house?.repairCost[2] ?? 0,
                  concrete: house?.repairCost[3] ?? 0,
                  steel: house?.repairCost[4] ?? 0,
                }}
              />}
          </div>
        </div>
        <div className="d-none d-sm-block">
          <RepairButton
            repair={() => repairWithAmount(house, setHouse, setDisplayPercent, displayPercent)}
            isLoading={isLoading}
            activated={house.isActivated && !house.onSale}
          />
        </div>
      </div>
      <div className="input-group d-block d-sm-none mb-3 mobile-reparing-section reparing-section position-relative">
        <div
          className={`main-reparing-cost h-100 d-flex py-2 justify-content-between main-reparing-cost-allow`}
        >
          <div className="d-flex d-sm-none repair-cost w-100">
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
        <div className="d-block d-sm-none">
          <RepairButton
            repair={() => repairWithAmount(house, setHouse, setDisplayPercent, displayPercent)}
            isLoading={isLoading}
            activated={house.isActivated && !house.onSale}
          />
        </div>
      </div>
    </>
  );
};
