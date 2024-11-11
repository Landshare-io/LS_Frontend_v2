import React from "react";
import { useRouter } from "next/router";
import { BREADCRUMB } from "../../../utils/type";
import { BOLD_INTER_TIGHT } from "../../../config/constants/environments";

interface BreadcrumbProps {
  items: BREADCRUMB[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-[12px] mb-0">
      {items.map((item, index) => (
        <React.Fragment key={`breadcrumb-item-${index}`}>
          <span 
            className={`text-[14px] leading-[22px] text-[#61CD81] pl-0 cursor-pointer ${(index == items.length - 1) ? '!cursor-default !text-[#0A133999] !opacity-60' : ''} ${BOLD_INTER_TIGHT.className}`}
            onClick={() => {
              if ((index != items.length - 1))
                router.push(item.url)
            }}
          >
            {item.name}
          </span>
          {(index < items.length - 1) && (
            <span className={`text-[14px] leading-[22px] text-[#61CD81] ${BOLD_INTER_TIGHT.className}`}>/</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
