import React from "react";
import { IconType } from "react-icons";

interface FeatureBadgeProps {
  icon?: string;
  text: string;
  type?: string;
  containerClassName?: string;
  IconComponent?: IconType;
}

export default function FeatureBadge({
  icon,
  text,
  type,
  containerClassName,
  IconComponent,
}: FeatureBadgeProps) {
  return (
    <div
      className={`flex items-center gap-[8px] rounded-[50px] w-fit py-[4px] pl-[4px] pr-[20px] md:py-[6px] md:pl-[6px] ${
        type == "gray" ? "bg-primary" : "bg-secondary"
      } ${containerClassName}`}
    >
      <div
        className={`w-[32px] h-[32px] p-[4px] rounded-[30px] text-primary-green ${
          type == "gray" ? "bg-[#ffffff] dark:bg-secondary" : "bg-primary"
        }`}
      >
        {IconComponent ? (
          <IconComponent className="w-[24px] h-[24px]" />
        ) : (
          <img src={icon} alt="icon" className="w-[24px] h-[24px] p-[2px]" />
        )}
      </div>
      <div className="font-[500] text-[12px] lg:text-[14px] leading-[20px] lg:leading-[22px] tracking-[0.02em] text-[#0A0A0A] dark:text-[#f1f1f1]">
        {text}
      </div>
    </div>
  );
}
