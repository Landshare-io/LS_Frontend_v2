import React from 'react';
import ReactLoading from 'react-loading';
import {
  ChargeIcon,
  BrickIcon,
  LumberIcon,
  ConcreteIcon,
  SteelIcon
} from "../../common/icons/nft"
import Button from '../../common/button';
import { useTheme } from "next-themes";
import { BOLD_INTER_TIGHT } from '../../../config/constants/environments';

interface FacilityContentProps {
  nextLevel: number;
  type: number;
  maxLevel: number;
  color: string;
  upgradeFacility: Function;
  isLoading: any;
  activated?: boolean;
  nextLevelInfo: any;
}

export default function FacilityContent({
  nextLevel,
  type,
  maxLevel,
  color,
  upgradeFacility,
  isLoading,
  nextLevelInfo,
  activated = false
}: FacilityContentProps) {
  const { theme } = useTheme();
  const icons = [
    <ChargeIcon className="" iconColor={theme == 'dark' ? '#cfcbcb' : '#323131'} />,
    <LumberIcon className="" iconColor={theme == 'dark' ? '#cfcbcb' : '#323131'} />,
    <BrickIcon className="" iconColor={theme == 'dark' ? '#cfcbcb' : '#323131'} />,
    <ConcreteIcon className="" iconColor={theme == 'dark' ? '#cfcbcb' : '#323131'} />,
    <SteelIcon className="" iconColor={theme == 'dark' ? '#cfcbcb' : '#323131'} />
  ]

  return (
    <>
      {nextLevel > maxLevel ? (
        <div className={`flex w-full h-[130px] rounded-[25px] bg-transparent justify-center items-center ${color}`}>
          <span className={`my-3 text-[#1eceae] text-[24px] font-bold ${BOLD_INTER_TIGHT.className}`}>LEVEL {maxLevel}</span>
        </div>
      ) : (
        <div className={`flex flex-col w-full h-[130px] rounded-[25px] bg-[#fff] relative pb-0 ${color} bg-primary`}>
          {nextLevelInfo ? (
        <>
          <div className='flex flex-col px-[14px] pt-[12px]'>
            <div className='flex items-center'>
              <span className='text-[#6f899d] font-semibold text-[10px] ml-[4px] pr-[2px]'>Yield: </span>
              <div className='flex items-center'>
                <span className='text-[16px] font-semibold mr-[5px]'>{`${(nextLevelInfo.buyReward[2 + type])} `}</span>
                {icons[type]}
                <span className='text-[12px] font-semibold ml-[2px]'> /day</span>
              </div>
            </div>
            <div className="border-b-[1px] border-[#494949] my-[7px] w-full"></div>
          </div>
          <div className='flex pb-2 items-center px-[14px]'>
            <span className='text-[#6f899d] font-semibold text-[10px] ml-[4px] pr-[2px]'>Cost: </span>
            <div className='w-full'>
              <div className='flex justify-between'>
                {nextLevelInfo.buy.slice(2, 7).map((cost: number[], index: number) => {
                  if (Number(cost) > 0) 
                    return (
                      <div key={`next-cost-${index}`} className='flex items-center min-w-[20px] text-[16px] font-semibold gap-[2px]'>
                        {`${cost} `}
                        {icons[index]}
                      </div>
                    )
                })}
                {nextLevelInfo.buy.slice(2, 7).map((cost: number[], index: number) => {
                  if (Number(cost) <= 0) 
                    return (
                      <div key={`next-empty-${index}`} className='min-w-[20px]'>
                      </div>
                    )
                })}
              </div>
            </div>
          </div>
        </>
      ) : null}
          <Button
            onClick={() => upgradeFacility(type)}
            className={`w-full bottom-[-1px] h-[45px] text-[18px] font-semibold absolute text-button-text-secondary rounded-[20px] ${((isLoading.type > -1) && (isLoading.type != type)) ? 'grey' : color} ${((isLoading.type == type) && isLoading.loading) ? 'flex justify-center items-center' : ''}`}
            disabled={((isLoading.type == type) && isLoading.loading) || !activated || ((isLoading.type > -1) && (isLoading.type != type))}
          >
            {((isLoading.type == type) && isLoading.loading) ? (
              <div className='flex justify-center items-center'>
                <ReactLoading type="spin" className="mr-2 mb-[4px]" width="24px" height="24px" />
                <span className="font-semibold">Loading</span>
              </div>
            ) : (
              <>
                <span className="text-[16px] font-semibold">{nextLevel == 1 ? 'BUY' : 'UPGRADE'}</span>
                <span className="text-[0.7rem] font-normal ml-1">{nextLevel > 1 ? 'TO LEVEL ' + nextLevel : ''}</span>
              </>
            )}
          </Button>
        </div>
      )}
    </>
  )
}
