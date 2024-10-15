import React from "react";
import "./Input.css";
import { BOLD_INTER_TIGHT } from "../../../config/constants/environments";

interface InputProps {
  labelClassName?: string
  containerClassName?: string
  proposal: string
  label?: string | JSX.Element
  error: string
  setValue: Function
  max?: string
  setError: Function
  value: string
  unit?: number | string | null
}

export default function Input({
  labelClassName,
  containerClassName,
  proposal,
  label = '',
  error,
  setValue,
  max = '0',
  setError,
  value,
  unit = null
}: InputProps) {
  const handleChangeValue = (e: any) => {
    const v = e.target.value;
    const re = proposal == "Change Auto LAND Fee" ? /^(\d)*(\.)?([0-9]{1})?$/  : /^[0-9\b]+$/ 
    if (v === "" || re.test(v)) {
      setValue(v);
      if (proposal == "Burn Tokens") {
        if (parseInt(v) > parseInt(max)) {
          setError("Not enough balance");
        } else {
          setError("");
        }
      } else if (proposal == "Change Auto LAND Fee") {
        if (v != "" && (v < 1 || v > 5)) {
          setError("Input between 1 and 5");
        } else {
          setError("");
        }
      } else if (proposal == "Add to Marketing Fund") {
        if (parseInt(v) > parseInt(max)) {
          setError("Max exceeded");
        } else {
          setError("");
        }
      }
      else if (proposal == "Request Grant") {
        if (parseInt(v) > parseInt(max)) {
          setError("Max exceeded");
        } else {
          setError("");
        }
      }
    }
  };

  const fillWithMax = () => {
    setValue(max);
  };

  return (
    <>
      <div className={`text-[15px] pl-[3px] ${labelClassName}`}>{label}</div>
      <div className={`relative ${containerClassName}`}>
        <input
          className={`w-full border-[1px] border-[#fff] rounded-[12px] py-[5px] px-[10px] text-[14px] text-[#000] focus:border-[#cdcdcd] outline-0 ${error == "" ? "" : "border-[#d45050]"}`}
          value={value}
          onChange={handleChangeValue}
          step={".01"}
        />
        {error != "" && <div className="absolute left-0 botton-[-15px] text-[11px] text-[#d45050]">{error}</div>}
        {max != null && (
          <button className={`cursor-pointer bg-transparent absolute border-0 outline-0 z-1 top-[5px] right-[7px] font-black text-[14px] text-[#cdcdcd] ${BOLD_INTER_TIGHT.className}`} onClick={fillWithMax}>
            MAX
          </button>
        )}
        {unit != null && <div className={`absolute z-1 top-[5px] right-[10px] font-black text-[14px] text-[#cdcdcd] ${BOLD_INTER_TIGHT.className}`}>{unit}</div>}
        
      </div>
    </>
  );
};
