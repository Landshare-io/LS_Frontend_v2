import React from 'react';
import { BOLD_INTER_TIGHT } from '../../../config/constants/environments';

interface BadgeProps {
  label1: string
  label2: string
  className?: string
}

export default function Badge({ 
  label1, 
  label2, 
  className 
}: BadgeProps) {
  return (
    <div className={`flex rounded-full w-[38px] h-[38px] itmes-center justify-center ${className}`}>
      <div className='flex items-center'>
        <span className={`text-[0.6rem] pt-[0.2rem] text-[#000] ${BOLD_INTER_TIGHT.className}`}>{label1}</span>
        <span className='text-[#000] font-semibold ml-1'>{label2}</span>
      </div>
    </div>
  )
}
