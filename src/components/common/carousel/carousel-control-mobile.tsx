import React, { useEffect, useState } from "react";

interface CarouselControlMobile {
  count: number;
  activeIndex: number;
  setActiveIndex: Function;
}

export default function CarouselControlMobile({ count, activeIndex, setActiveIndex }: CarouselControlMobile) {
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
    <div className="flex justify-between items-center top-[300px] md:top-[250px] padding-0 left-0 z-10 w-full py-[20px] pr-[20px] justify-center">
      <div className="flex justify-center gap-[10px] visibility-visible">
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
}
