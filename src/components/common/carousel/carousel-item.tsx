import React from "react";

interface CarouselItemProps {
  children: JSX.Element;
  containerClassName?: string;
  activeIndex: number;
  active?: boolean;
}

const CarouselItem = ({ children, containerClassName, active, activeIndex }: CarouselItemProps) => {
  return (
    <div 
      className={`inline-block w-full padding-0 whitespace-nowrap duration-300 ${active ? 'visible' : ''} ${containerClassName}`}
      style={{
        transform: `translateX(-${activeIndex * 100}%)`,
      }}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child);
        }
        return child;
      })}
    </div>
  );
};

export default CarouselItem;
