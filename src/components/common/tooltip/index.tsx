import { useState, useRef, useEffect } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  tooltipContainerClassName?: string;
  tooltipClassName?: string;
  disabled?: boolean;
}

export default function Tooltip({
  children,
  content,
  position = "top",
  delay = 200,
  tooltipContainerClassName = "",
  tooltipClassName = "",
  disabled = false,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const touchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(touchDevice);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const handleMouseEnter = () => {
    if (disabled || isTouchDevice) return;
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const handleMouseLeave = () => {
    if (disabled || isTouchDevice) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };

  const handleTouchStart = () => {
    if (disabled) return;
    setVisible(!visible);
  };

  const handleFocus = () => {
    if (disabled) return;
    setVisible(true);
  };

  const handleBlur = () => {
    if (disabled) return;
    setVisible(false);
  };

  return (
    <div
      className={`relative inline-flex items-center ${tooltipContainerClassName}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onFocus={handleFocus}
      onBlur={handleBlur}
      ref={triggerRef}
      role="tooltip"
      aria-describedby={visible ? "tooltip-content" : undefined}
    >
      <div
        id="tooltip-content"
        className={`
          absolute z-50 min-w-[100px] text-wrap h-fit px-3 py-2 text-xs md:text-sm rounded-lg shadow-lg
          bg-gray-800 text-white
          opacity-0 transition-all duration-200
          ${visible ? "opacity-100" : "pointer-events-none"}
          ${positionClasses[position]}
          ${tooltipClassName}
        `}
      >
        {content}
      </div>
      {children}
    </div>
  );
}
