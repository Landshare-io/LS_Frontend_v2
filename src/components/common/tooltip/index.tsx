import { useState } from 'react';

interface TooltipProps {
  children: JSX.Element;
  title: string | JSX.Element;
  tooltipContainerClassName?: string;
  tooltipClassName?: string;
}

export default function Tooltip({ children, title, tooltipContainerClassName = '', tooltipClassName = '' }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={`relative flex items-center ${tooltipContainerClassName}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {visible && (
        <div className={`bg-primary text-text-primary absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-2 text-sm rounded-lg shadow-lg ${tooltipClassName}`}>
          {title}
          <div className="tooltip-arrow absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-3 h-3 bg-primary rotate-45"></div>
        </div>
      )}
      {children}
    </div>
  );
};
