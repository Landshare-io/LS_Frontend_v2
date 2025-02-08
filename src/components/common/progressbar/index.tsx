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
    <div className="w-full bg-gray-200 dark:bg-slate-400 rounded-lg overflow-hidden h-6 relative">
      <div
        className={`h-full ${color} ${striped ? "bg-stripes bg-[length:1rem_1rem]" : ""} ${
          animated ? "animate-[progress]" : ""
        }`}
        style={{ width: `${progress}%` }}
      >
      </div>
      {label && (
        <span className="text-black absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%] text-[16px] font-semibold px-2">
          {label}
        </span>
      )}
    </div>
  );
};
