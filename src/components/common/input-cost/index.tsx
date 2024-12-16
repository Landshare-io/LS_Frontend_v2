import React, { useEffect, useState } from "react";
import numeral from "numeral";
import { useGlobalContext } from "../../../context/GlobalContext";

interface InputCostProps {
  width?: number;
  height?: number;
  value: string | number;
  changeRepairAmount: any;
  calcMaxAmount: any;
}

export default function InputCost({ width, height = 0, value, changeRepairAmount, calcMaxAmount }: InputCostProps) {
  const { theme } = useGlobalContext();
  const [showValue, setShowValue] = useState('0');

  useEffect(() => {
    setShowValue(numeral(value).format('0.[00]'));
  }, [value]);

  return (
    <div
      className={`relative border-[1px] border-[#0000001a] rounded-[5px] py-[0.125rem] flex px-2 ${theme == 'dark' ? "border-[#ffffff28]" : "border-[#00000028]"}`}
      style={height ? { height: `${height}px` } : {}}
    >
      <input
        type="text"
        className="border-0 mr-[40px] bg-transparent focus-visible:outline-0"
        style={{ width: `${width}px` }}
        value={showValue}
        onChange={(e) => changeRepairAmount(e.target.value)}
      />
      <button 
        className='text-[#2b4532] absolute right-0 bg-[#dbffe5] border-[1px] border-[#dbffe5] rounded-[10px] border-0 translate-y-[-50%] top-[50%] duration-300 px-2 mr-2 text-[11px] py-1' 
        onClick={(e) => calcMaxAmount()}
      >
        MAX
      </button>
    </div>
  )
}
