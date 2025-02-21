import React from "react";

interface ProgressBar {
  now: number;
  min: number;
  max: number;
  label?: string;
  striped?: boolean;
  animated?: boolean;
  color?: string;
}

export default function ProgressBar({
  now = 0,
  min = 0,
  max = 100,
  label = "",
  striped = false,
  animated = false,
  color = "bg-blue-500",
}: ProgressBar) {
  const progress = Math.min(100, Math.max(0, ((now - min) / (max - min)) * 100));

  return (
    <div className="w-full rounded-[6px] overflow-hidden h-6 relative h-[24px] border-[2px] border-[#d0d0d0] border-solid">
      <div
        className={`bg-[#0b6c96] h-full transition-all duration-300 ease-in flex items-center justify-center`}
        style={{ width: `${progress}%` }}
      >
        {progress > 0 ? (
          <span className="text-white absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%] text-xs font-semibold px-2">
            {label}
          </span>
        ) : ""}
      </div>
      
    </div>
  );
};
