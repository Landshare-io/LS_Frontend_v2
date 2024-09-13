import React, { useEffect, useState } from "react";

interface CarouselControlProps {
  count: number; 
  isIndicator: boolean;
  activeIndex: number;
  setActiveIndex: Function;
  carouselControlClass: string;
}

export default function CarouselControl({ 
  count, 
  isIndicator,
  activeIndex,
  setActiveIndex,
  carouselControlClass,
}: CarouselControlProps) {
  const [paused, setPaused] = useState(false);

  const updateIndex = (newIndex: number) => {
    if (newIndex < 0) {
      newIndex = count - 1;
    } else if (newIndex >= count) {
      newIndex = 0;
    }

    setActiveIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        updateIndex(activeIndex + 1);
      }
    }, 10000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  });

  return (
    <div
      className={`flex justify-between items-center top-[300px] md:top-[250px] px-[20px] ${carouselControlClass}`}
    >
      <div className={`flex visibility-hidden ${isIndicator ? 'visibility-visible' : ''}`}>
        {Array.apply(null, Array(count)).map((child, index) => {
          return (
            <div
              className={`w-[12px] h-[12px] opacity-[0.2] bg-[#00352e] rounded-[16px] border-0 outline-0 padding-0 dark:bg-[#cacaca] ${index === activeIndex ? 'rounded-[16px] opacity-1 bg-[#61cd81]' : ''}`}
              key={`indicator-${index}`}
              onClick={() => {
                updateIndex(index);
              }}
            />
          );
        })}
      </div>
      
    </div>
  );
};
