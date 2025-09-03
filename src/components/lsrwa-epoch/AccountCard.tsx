'use client';

import { useDepositorAccount } from '@/hooks/lsrwa-epoch/useDepositorAccount';
import ToggleSwitchButton from "./ToggleSwitchButton";
import numeral from "numeral";
import { IoIosInformationCircleOutline } from "react-icons/io";
import Tooltip from '../common/tooltip';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';

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
    refetch,
    isLoading } = useDepositorAccount();

  const { isConnected } = useAccount()
  const [clicked, setClicked] = useState(false)

  const handleAutoCompoundClick = async () => {
    setClicked(true)
    await setAutoCompound(!autoCompound);
    setClicked(false)
    refetch()

  };
  const handleHarvest = () => {
    harvestReward();
  };
  const handleCompound = () => {
    compound();
  };

  useEffect(() => {
    refetch()
  }, [autoCompound])

  return (
    <div className="flex flex-col justify-between w-full h-[179px] md:h-[210px] border-green bg-third rounded-[20px] p-[20px] md:py-[27px] md:pl-[35px] md:pr-[17px]">
      <div className='flex justify-between w-full'>
        <p className='text-[16px] w-[157px] md:w-[100px] md:text-[20px] text-text-primary font-bold leading-[22px]'>Account Details</p>
        <div className='flex flex-col justify-end items-end text-right'>
          {isConnected === false && (<ToggleSwitchButton disable={true} />)}
          {isConnected === true && clicked === false && (<ToggleSwitchButton checked={autoCompound} disable={isLoading} handleAutoCompoundClick={handleAutoCompoundClick} />)}
          {isConnected === true && clicked === true && (<ToggleSwitchButton checked={autoCompound} disable={isLoading} handleAutoCompoundClick={() => console.log('processing')}/>)}
          <div className='flex items-center justify-center gap-1'>
            <p className='text-[11px] md:text-[12px] font-normal leading-[22px]'>Auto-compound
            </p>
            <Tooltip
              content="Toggling this feature on will result in the automatic deposit of yields each epoch."
              position='bottom'
            >
              {/* svg icon must be wrapped in a div */}
              <div>
                <IoIosInformationCircleOutline color='#239942' size={12} />
              </div>
            </Tooltip>

          </div>
        </div>
      </div>
      <div className='flex justify-center w-full items-center gap-[10px] md:gap-[13px]'>
        <div className='text-center py-[8px] px-[15px] bg-primary rounded-[6px] w-[150px] md:w-[141px]'>
          <p className='text-text-secondary font-semibold text-[12px]'>Current Balance</p>
          <p className='text-[20px] font-bold leading-[30px]'>$ {isLoading ? 0 : deposited}</p>
          <p className='text-text-third font-normal text-[11px]'>Currently Deposited</p>
        </div>
        <div className='text-center'>
          <div className='text-center py-[8px] px-[12px] bg-primary rounded-[6px] w-[150px] md:w-[141px]'>
            <p className='text-text-secondary font-semibold text-[12px]'>Available Yield</p>
            <p className='text-[20px] font-bold leading-[30px]'>$ {isLoading ? 0 : numeral(reward).format("0.[00]").toString()}</p>
            <p className='text-text-third font-normal text-[11px]'>Total earnings To date</p>
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
