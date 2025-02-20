import { useState } from "react";
import { useGlobalContext } from "../../../context/GlobalContext";

interface ToggleSwitchProps {
  isSale: boolean;
  className?: string;
  onClick: Function;
  disabled?: boolean;
}

export default function ToggleSwitch({ isSale, className, onClick, disabled }: ToggleSwitchProps) {
  const { theme } = useGlobalContext();

  return (
    <>
      <div className="flex items-center for-sale">
        <div className="ml-1 sm:ml-3 on-off-toggle">
          <input type="checkbox" id="bopis" checked={isSale} className="hidden peer on-off-toggle__input" />
          <label htmlFor="bopis" className="on-off-toggle__slider rounded-full" onClick={() => onClick()}></label>
        </div>
    </div>
  </>
  );
}
