import React from "react";

interface CarouselItemProps {
  children: JSX.Element;
  containerClassName?: string;
  activeIndex: number;
  active?: boolean;
  variant?: "allowShadow";
}

const CarouselItem = ({
  children,
  containerClassName,
  active,
  activeIndex,
  variant
}: CarouselItemProps) => {
  return (
    <div
      className={`inline-block w-full p-0 whitespace-nowrap duration-300 ${
        active ? "visible" : ""
      } 
      ${variant == "allowShadow" ? "p-2" : "" } 
      ${containerClassName}`}
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
