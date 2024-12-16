import React from "react";

interface NextButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function NextButton ({
  onClick
}: NextButtonProps) {
  return (
    <>
      <div className="absolute bottom-0 right-0">
        <button 
          className="w-[110px] h-[40px] bg-[#61cd81] border-0 rounded-[12px] font-bold text-[18px] leading-[22px] duration-500 hover:bg-[#87D99F] active:bg-[06B844] disable:bg-[#3c3c3b33] text-button-text-secondary" 
          onClick={onClick}
        >
          Next
        </button>
      </div>
    </>
  );
};
