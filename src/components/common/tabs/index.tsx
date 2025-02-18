import React, { useState } from "react";
import { BOLD_INTER_TIGHT } from "../../../config/constants/environments";

interface MainTabs {
  tabItems: any[]
}

export default function MainTabs({ tabItems }: MainTabs) {
  const [activeTab, setActiveTab] = useState(tabItems[0].id);

  return (
    <div>
      <div className="flex justify-between border-b-[1px] border-[#dee2e6] overflow-x-auto">
        {tabItems.map((tabItem, index) => (
          <button
            key={`${tabItem.id}-${index}`}
            onClick={() => setActiveTab(tabItem.id)}
            className={`whitespace-nowrap px-4 py-2 text-[14px] md:text-[20px] font-medium border-b-[1px] ${BOLD_INTER_TIGHT.className} ${
              activeTab === tabItem.id
                ? "border-[#000000] text-[#000] dark:text-white dark:border-white"
                : "text-[#000000b3] hover:text-[#000] dark:border-none hover:border-[#000000] dark:text-[#a0a0a0] dark:hover:text-[#f1f1f1] dark:hover:border-white"
            }`}
          >
            {tabItem.id}
          </button>
        ))}
      </div>

      <div>
        {tabItems.map(
          (tabItem, index) =>
            activeTab === tabItem.id && (
              <div key={`${tabItem.id}-content-${index}`}>
                {tabItem.children}
              </div>
            )
        )}
      </div>
    </div>
  );
}
