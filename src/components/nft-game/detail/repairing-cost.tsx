import React from "react";
import numeral from "numeral";
import Dropdown from "../../common/dropdown";
import ReparingCostList from "./repairing-cost-list";
import { ChargeIcon } from "../../common/icons/nft";
import './ReparingCost.css';

interface RepairingCostProps {
  cost: any;
  className: string;
}

export default function ReparingCost({ cost, className }: RepairingCostProps) {
  return (
    <div className={`w-full flex items-center pr-[20px] ${className}`}>
      <span className="mx-1 text-[14px] text-tw-text-secondary">Cost:</span>
      <div className="hidden md:flex w-full">
        <ReparingCostList cost={cost} />
      </div>
      <div className="d-flex dropdown-list-style d-md-none">
        <Dropdown>
          <Dropdown.Toggle>
            <span className="pe-1">{numeral(cost["power"]).format('0.[00]')}</span><ChargeIcon />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <div className="d-flex flex-column px-3">
              <ReparingCostList cost={cost} />
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};
