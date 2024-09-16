import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

interface CarouselProps {
  children: JSX.Element[];
  containerClassName?: string;
  activeIndex: number;
  setActiveIndex: Function;
  setPaused: Function;
}

export default function Carousel({
  children,
  containerClassName,
  activeIndex,
  setActiveIndex,
  setPaused
}: CarouselProps) {
  const count = children.length;

  const updateIndex = (newIndex: number) => {
    if (newIndex < 0) {
      newIndex = count - 1;
    } else if (newIndex >= count) {
      newIndex = 0;
    }

    setActiveIndex(newIndex);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => updateIndex(activeIndex + 1),
    onSwipedRight: () => updateIndex(activeIndex - 1),
  });

  return (
    <div 
      className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${containerClassName}`}
      {...handlers}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
          active: index === activeIndex,
          key: `indicator-${index}`,
          activeIndex: activeIndex,
        });
      })}
    </div>
  );
};
