import React from "react";
import ReactLoading from 'react-loading';
import { BOLD_INTER_TIGHT } from "../../../config/constants/environments";

interface RepairButtonProps {
  repair: Function;
  isLoading: boolean;
  activated: boolean;
}

export default function RepairButton({ repair, isLoading, activated }: RepairButtonProps) {
  return (
    <>
      <button
        className={`btn text-[16px] absolute text-button-text-secondary right-[-1px] rounded-[24px] w-[145px] h-[44px] text-[#fff] duration-400 capitalize whitespace-nowrap btn-repair-${(activated) ? "allow" : "disable"
          } ${isLoading ? 'flex justify-center items-center' : ''} ${BOLD_INTER_TIGHT.className}`}
        onClick={() => repair()}
        disabled={!activated || isLoading}
      >
        {isLoading ? (
          <>
            <ReactLoading type="spin" className="me-2 mb-[4px]" width="24px" height="24px" />
            <span className="font-semibold">Loading</span>
          </>
        ) : (
          'REPAIR'
        )}
      </button>
    </>
  );
};
