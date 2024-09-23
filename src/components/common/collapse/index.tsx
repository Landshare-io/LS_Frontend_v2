import { useState } from 'react';

interface CollapseProps {
  children: JSX.Element;
  isOpen: boolean;
}

export default function Collapse({ children, isOpen }: CollapseProps) {
  return (
    <div className="w-full">
      {isOpen && (
        <div className={`transition-[max-height] ease-in-out duration-300 overflow-hidden`}>
          {children}
        </div>
      )}
    </div>
  );
}
