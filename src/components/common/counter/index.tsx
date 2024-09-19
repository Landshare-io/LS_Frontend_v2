import React, { useState, useEffect } from 'react';
import ReactLoading from 'react-loading';
import { BOLD_INTER_TIGHT } from '../../../config/constants/environments';

interface CounterProps {
  number: string;
  duration: number;
  decimal: number;
  formatType: string;
}

const Counter = ({ number, duration, decimal, formatType }: CounterProps) => {
  const [count, setCount] = useState("0");
  const [isloading, setIsLoading] = useState(false);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(number);

    if (start === end || isNaN(end) || !isFinite(end)) {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);
    let incrementTime = duration * 5;
    let ctimer = setInterval(() => {
      if (Number(start.toFixed(decimal)) > Number(end.toFixed(decimal))) {
        clearInterval(ctimer);
        return;
      }
      setCount(String(start.toFixed(decimal)))
      start += end / duration;
    }, incrementTime);

    return () => clearInterval(ctimer);
  }, [number, duration, decimal]);

  const renderContent = () => {
    if (isloading) {
      return (
        <ReactLoading type={"spin"} width={"24px"} height={"24px"} color={"#000"} />
      );
    }
  
    const formattedNumber = Number(count).toLocaleString(undefined, { maximumFractionDigits: decimal });
  
    if (formatType === 'percent') {
      return `${formattedNumber}%`;
    } else if (formatType === 'dollar') {
      return `$${formattedNumber}`;
    } else {
      return formattedNumber;
    }
  };

  return (
    <div className={`h-[24px] md:h-[36px] ${BOLD_INTER_TIGHT.className}`}>
      {renderContent()}
    </div>
  );
}

export default Counter;
