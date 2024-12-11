import React from "react";
import ReactLoading from 'react-loading';
import Button from "../../common/button";
import { BOLD_INTER_TIGHT } from "../../../config/constants/environments";

interface RepairButtonProps {
  repair: Function;
  isLoading: boolean;
  activated: boolean;
}

export default function RepairButton({ repair, isLoading, activated }: RepairButtonProps) {
  return (
    <>
      <Button
        className={`text-[16px] absolute text-button-text-secondary bottom-0 md:top-0 right-[-1px] rounded-[24px] w-[145px] h-[44px] text-[#fff] duration-400 capitalize whitespace-nowrap ${(activated) ? "bg-[#61cd81] border-[2px] border-[#61cd81]" : "bg-[#8f8f8f] border-[2px] border-[#8f8f8f]"} ${isLoading ? 'flex justify-center items-center' : ''} ${BOLD_INTER_TIGHT.className}`}
        onClick={() => repair()}
        disabled={!activated || isLoading}
      >
        {isLoading ? (
          <div className="flex justify-center items-center">
            <ReactLoading type="spin" className="me-2 mb-[4px]" width="24px" height="24px" />
            <span className="font-semibold">Loading</span>
          </div>
        ) : (
          'REPAIR'
        )}
      </Button>
    </>
  );
};
