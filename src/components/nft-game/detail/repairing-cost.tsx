import React from "react";
import numeral from "numeral";
import Dropdown from "../../common/dropdown";
import ReparingCostList from "./repairing-cost-list";
import { ChargeIcon } from "../../common/icons/nft";

interface RepairingCostProps {
  cost: any;
  className: string;
}

export default function ReparingCost({ cost, className }: RepairingCostProps) {
  return (
    <div className={`w-full flex items-center ${className}`}>
      <span className="mx-1 text-[14px] text-text-secondary">Cost:</span>
      <div className="hidden md:flex w-full">
        <ReparingCostList cost={cost} />
      </div>
      <div className="flex md:hidden">
        <Dropdown>
          <Dropdown.Toggle onClick={() => {}}>
            <div className="flex items-center">
              <span className="pr-1">{numeral(cost["power"]).format('0.[00]')}</span><ChargeIcon />
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <div className="flex flex-col px-3 text-text-primary">
              <ReparingCostList cost={cost} />
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};
