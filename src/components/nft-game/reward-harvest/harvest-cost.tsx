import React from 'react'
import ReactLoading from 'react-loading';
import {
  ChargeIcon,
  BrickIcon,
  LumberIcon,
  ConcreteIcon,
  SteelIcon
} from '../../common/icons/nft';
import { useGlobalContext } from '../../../context/GlobalContext';
import Button from '../../common/button';

interface HarvestCardsProps {
  item: any
  colorType: number
  color: string
  btnLabel: string
  onPurcharse: Function
  isLoading: any
  type: number
}

export default function HarvestCost({
  item,
  colorType,
  color,
  btnLabel,
  onPurcharse,
  isLoading,
  type
}: HarvestCardsProps) {
  const { theme } = useGlobalContext();
  const disabledIcons = [
    <ChargeIcon className="" iconColor={theme == 'dark' ? '#8fbbd1' : '#263238'} />,
    <LumberIcon className="" iconColor={theme == 'dark' ? '#8fbbd1' : '#263238'} />,
    <BrickIcon className="" iconColor={theme == 'dark' ? '#8fbbd1' : '#263238'} />,
    <ConcreteIcon className="" iconColor={theme == 'dark' ? '#8fbbd1' : '#263238'} />,
    <SteelIcon className="" iconColor={theme == 'dark' ? '#8fbbd1' : '#263238'} />
  ]
  const activeIcons = [
    <ChargeIcon className="" iconColor={theme == 'dark' ? '#8fbbd1' : '#263238'} />,
    <LumberIcon className="" iconColor={theme == 'dark' ? '#8fbbd1' : '#263238'} />,
    <BrickIcon className="" iconColor={theme == 'dark' ? '#8fbbd1' : '#263238'} />,
    <ConcreteIcon className="" iconColor={theme == 'dark' ? '#8fbbd1' : '#263238'} />,
    <SteelIcon className="" iconColor={theme == 'dark' ? '#8fbbd1' : '#263238'} />
  ]

  return (
    <div className={`flex flex-col w-full h-[130px] rounded-[25px] bg-[#ffffff] relative bg-secondary ${color}`}>
      <div className='flex flex-col px-2 pt-2'>
        <div className='flex items-center justify-between'>
          {item.buyReward.slice(0, 7).map((percent: number, index: number) => {
            if (Number(percent) > 0) {
              return (
                <div key={`reduction-percent-${index}`}>
                  <span className='font-semibold text-[10px] ml-[4px] pr-[2px] text-text-secondary'>Production: </span>
                  <span className={`${theme == 'dark' ? 'text-[#dee2e6]' : 'text-[#323131]'} font-semibold text-[12px]`}>{`${percent * 100}%`}</span>
                </div>
              )
            }
          })}
        </div>
        <div className="border-b-[1px] border-[#00000050] w-full my-2"></div>
      </div>
      <div className='flex items-center px-2'>
        <span className='font-semibold text-[10px] ml-[4px] pr-[2px] text-text-secondary'>Cost: </span>
        <div className='w-full'>
          <div className='flex justify-between'>
            {item.buy.slice(2, 7).map((cost: number, index: number) => {
              if (Number(cost) > 0)
                return (
                  <div key={`next-cost-${index}`} className={`flex gap-[1px] items-center min-w-[20px] text-[14px] font-medium ${theme == 'dark' ? 'text-[#dee2e6]' : 'text-[#323131]'}`}>
                    {colorType == 0 ? (
                      <>
                        {`${cost} `}
                        {disabledIcons[index]}
                      </>
                    ) : (
                      <>
                        {`${cost} `}
                        {activeIcons[index]}
                      </>
                    )}
                  </div>
                )
            })}
            {item.buy.slice(2, 7).map((cost: number, index: number) => {
              if (Number(cost) <= 0)
                return (
                  <div key={`next-empty-${index}`} className='min-w-[20px]'>
                  </div>
                )
            })}
          </div>
        </div>
      </div>
      <Button
        onClick={() => onPurcharse()}
        className={`w-full bottom-[-1px] h-[45px] text-[18px] font-semibold absolute rounded-[20px] text-button-text-secondary ${(btnLabel == "ACTIVE") ? 'disabled:!bg-[#00a8f3]' : ''} ${((isLoading.type > -1) && (isLoading.type != type)) ? 'disable' : color} ${((isLoading.type == type) && isLoading.loading) ? 'flex justify-center items-center' : ''}`}
        disabled={(color != "border-[2px] border-[#ec9821] bg-[#ec9821]") || (btnLabel == "ACTIVE") || ((isLoading.type == type) && isLoading.loading) || ((isLoading.type > -1) && (isLoading.type != type))}
      >
        {((isLoading.type == type) && isLoading.loading) ? (
          <div className='flex justify-center items-center'>
            <ReactLoading type="spin" className="me-2 mb-[4px]" width="24px" height="24px" />
            <span className="font-semibold">Loading</span>
          </div>
        ) : (
          <span className="font-semibold">{btnLabel}</span>
        )}
      </Button>
    </div>
  )
}
