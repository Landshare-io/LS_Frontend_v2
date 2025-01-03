import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

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
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

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

  // Add click outside handler for mobile
  useEffect(() => {
    if (!visible || !isTouchDevice) return;

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as Node;
      // Check if the click is outside both the trigger and tooltip
      if (
        triggerRef.current && 
        tooltipRef.current &&
        !triggerRef.current.contains(target) && 
        !tooltipRef.current.contains(target)
      ) {
        setVisible(false);
      }
    };

    const handleScroll = () => {
      if (isTouchDevice) {
        setVisible(false);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [visible, isTouchDevice]);

  useEffect(() => {
    if (!visible || !triggerRef.current) return;

    const updatePosition = () => {
      const triggerElement = triggerRef.current;
      if (!triggerElement) return;

      const tooltipElement = tooltipRef.current;
      if (!tooltipElement) return;

      const rect = triggerElement.getBoundingClientRect();
      const tooltipRect = tooltipElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const EDGE_PADDING = 16;

      let top = 0;
      let left = 0;

      switch (position) {
        case "top":
          top = rect.top - tooltipRect.height - 8;
          left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          break;
        case "bottom":
          top = rect.bottom + 8;
          left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          break;
        case "left":
          top = rect.top + rect.height / 2 - tooltipRect.height / 2;
          left = rect.left - tooltipRect.width - 8;
          break;
        case "right":
          top = rect.top + rect.height / 2 - tooltipRect.height / 2;
          left = rect.right + 8;
          break;
      }

      const maxLeft = viewportWidth - tooltipRect.width - EDGE_PADDING;
      left = Math.max(EDGE_PADDING, Math.min(left, maxLeft));

      setTooltipPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [visible, position]);

  const handleMouseEnter = () => {
    if (disabled || isTouchDevice) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(true);
  };

  const handleMouseLeave = () => {
    if (disabled || isTouchDevice) return;
    timeoutRef.current = setTimeout(() => setVisible(false), delay);
  };

  const handleTouch = (e: React.TouchEvent) => {
    e.stopPropagation();
    setVisible(!visible);
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={`inline-block ${tooltipContainerClassName}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouch}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        {children}
      </div>
      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            className={`fixed z-50 w-[280px] px-2 py-1 text-sm text-white bg-gray-800 rounded shadow-lg pointer-events-auto ${tooltipClassName}`}
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left,
            }}
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              setVisible(true);
            }}
            onMouseLeave={handleMouseLeave}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}
