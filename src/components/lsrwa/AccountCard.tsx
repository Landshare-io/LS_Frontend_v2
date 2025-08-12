'use client';

import { useDepositorAccount } from '@/hooks/lsrwa/useDepositorAccount';
import ToggleSwitchButton from "./ToggleSwitchButton";
import { formatNumber } from '@/utils/helpers/format-numbers'

export default function AccountCard() {

  const {
    deposited,
    reward,
    autoCompound,
    setAutoCompound,
    compound,
    compounding,
    harvestReward,
    harvesting,
    isLoading } = useDepositorAccount();

  const handleAutoCompoundClick = () => {
    setAutoCompound(!autoCompound);
  };
  const handleHarvest = () => {
    harvestReward();
  };
  const handleCompound = () => {
    compound();
  };

  return (
    <div className="flex flex-col justify-between w-full h-[175px] border-green bg-secondary rounded-[11px] shadow-[1px_3px_4px_0px_rgba(0,0,0,0.15)] p-[14px]">
      <div className='flex justify-between w-full'>
        <p className='text-base font-medium leading-[22px]'>Account Details</p>
        <div className='flex flex-col justify-end items-end text-right'>
          <ToggleSwitchButton checked={autoCompound} disable={isLoading} handleAutoCompoundClick={handleAutoCompoundClick} />
          <p className='text-[14px] font-medium leading-[22px]'>Auto-compound </p>
        </div>
      </div>
      <div className='flex justify-between w-full items-center'>
        <div className='text-center'>
          <p className='text-text-secondary font-semibold'>Current Balance</p>
          <p className='text-[24px] font-bold leading-[30px]'>$ {isLoading ? 0 : deposited}</p>
          <p className='text-text-secondary font-medium text-[11px]'>Currently Deposited</p>

        </div>
        <div className='text-center'>
          <div>
            <p className='text-text-secondary font-semibold'>Available Yield</p>
            <p className='text-[24px] font-bold leading-[30px]'>$ {isLoading ? 0 : formatNumber(reward)}</p>
            <p className='text-text-secondary font-medium text-[11px]'>Total earnings To date</p>
          </div>
          {reward > 0 &&
            <div className="flex gap-2">
              <button className="px-2 py-1 bg-green text-white rounded-full" onClick={handleCompound}>{compounding ? 'Compounding' : 'Compound'}</button>
              <button className="px-2 py-1 bg-blue-500 text-white rounded-full" onClick={handleHarvest}>{harvesting ? 'Harvesting' : 'Harvest'}</button>
            </div>
          }
        </div>
      </div>
    </div>
  );
}
