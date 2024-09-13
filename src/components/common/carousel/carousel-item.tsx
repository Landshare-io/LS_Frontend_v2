import React from "react";
import "./style.css";

interface CarouselItemProps {
  children: JSX.Element[];
  containerClassName: string;
  activeIndex: number;
  active: boolean;
}

const CarouselItem = ({ children, containerClassName, active, activeIndex }: CarouselItemProps) => {
  return (
    <div className={`inline-block w-full padding-0 nowrap transition-all duration-300 translate-x-[${activeIndex * 100}%] ${active ? 'visible' : ''} ${containerClassName}`}>
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
