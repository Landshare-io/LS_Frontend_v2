import React from "react";
import { useState, useEffect } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useTheme } from "next-themes";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";
import 'react-loading-skeleton/dist/skeleton.css';

interface PropertyItemProps {
  property: any;
  isLoaded: boolean;
}

export default function PropertyItem({ property, isLoaded }: PropertyItemProps) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(isLoaded);
  }, [isLoaded]);

  return (
    <SkeletonTheme baseColor={`${theme == 'dark' ? "#31333b" : "#dbdde0"}`} highlightColor={`${theme == 'dark' ? "#52545e" : "#f6f7f9"}`}>
      <div className="flex w-full justify-between py-[13px]">
        <div className={`text-[14px] leading-[22px] tracking-[0.02em] ${BOLD_INTER_TIGHT.className}`}>{property.title}</div>
        {isLoading == true ? (
          <Skeleton className="rounded-lg" width={100} height={18} />
        ) : (
          <div className="text-[14px] leading-[22px] tracking-[0.02em]">${property.value}</div>
        )}
      </div>
      {property.subProperties && (
        <div className="w-full rounded-[12px] px-[16px] pb-[24px]">
          {property.subProperties.map((subProperty: any, index: number) => (
            <div className="flex w-full justify-between font-medium text-[12px] leading-[20px] py-[13px] text-center tracking-[0.02em]" key={`sub-properties-${index}`}>
              <div>{subProperty.title}</div>
              <div>${subProperty.value}</div>
            </div>
          ))}
        </div>
      )}
    </SkeletonTheme>
  );
}
