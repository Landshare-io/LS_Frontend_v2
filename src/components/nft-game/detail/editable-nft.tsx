import React, { useState, useEffect } from "react";
import Image from "next/image";
import Check from '../../../assets/img/icons/check.jpg';
import Close from '../../../assets/img/icons/close.png';

interface EditableNftProps {
  className?: string
  defaultValue: string
  onChangeValue: Function
  children: React.ReactNode
  target: string
}

export default function EditableNft({
  className = '',
  defaultValue,
  onChangeValue,
  children,
  target
}: EditableNftProps) {
  const [editable, setEditable] = useState(false);
  const [showValue, setShowValue] = useState(defaultValue);

  useEffect(() => {
    setShowValue(defaultValue)
  }, [defaultValue]);

  return (
    <>
      {editable ? (
        <div className={`relative border-[1px] border-[#00000080] pl-[15px] pr-[60px] rounded-[10px] overflow-hidden w-[380px] flex mb-3 md:mb-0 ${className}`}>
          <input 
            className="font-semibold" 
            value={showValue}
            onChange={(e) => setShowValue(e.target.value)}
          />
          <span className="absolute translate-y-[-50%] top-[50%] right-[10px]">
            <Image 
              src={Check} 
              className="h-[20px] mr-[5px] cursor-pointer" 
              alt="check" 
              onClick={() => {
                setEditable(false);
                onChangeValue(target, showValue);
              }}
            />
            <Image 
              src={Close} 
              className="h-[18px] cursor-pointer" 
              alt="close"
              onClick={() => {
                setShowValue(defaultValue);
                setEditable(false);
              }} 
            />
          </span>
        </div>
      ) : (
        <div className="flex items-center">
          {children}
        </div>
      )}
    </>
  );
}
