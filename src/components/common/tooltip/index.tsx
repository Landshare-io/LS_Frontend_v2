import { useState } from 'react';

interface TooltipProps {
  children: JSX.Element;
  title: string | JSX.Element;
}

export default function Tooltip({ children, title }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {visible && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg">
          {title}
          <div className="tooltip-arrow absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-3 h-3 bg-gray-800 rotate-45"></div>
        </div>
      )}
      {children}
    </div>
  );
};
