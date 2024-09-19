import React, { useState, useRef, useEffect } from 'react';

interface OverlayTriggerProps {
  trigger?: 'hover' | 'click';
  overlay: JSX.Element;
  children: JSX.Element;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export default function OverlayTrigger({ trigger = 'hover', overlay, children, placement = 'bottom' }: OverlayTriggerProps) {
  const [show, setShow] = useState(false);
  const triggerRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        trigger === 'click' &&
        overlayRef.current &&
        triggerRef.current &&
        !(overlayRef.current as HTMLDivElement).contains(target) &&
        !(triggerRef.current as HTMLDivElement).contains(target)
      ) {
        setShow(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [trigger]);

  const handleMouseEnter = () => {
    if (trigger === 'hover') setShow(true);
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') setShow(false);
  };

  const handleClick = () => {
    if (trigger === 'click') setShow(!show);
  };

  const getPlacementClasses = () => {
    switch (placement) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'top-full';
    }
  };

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-pointer"
      >
        {children}
      </div>

      {show && (
        <div
          ref={overlayRef}
          className={`absolute z-10 p-2 bg-gray-700 text-white text-sm rounded-md shadow-md ${getPlacementClasses()}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {overlay}
        </div>
      )}
    </div>
  );
};
