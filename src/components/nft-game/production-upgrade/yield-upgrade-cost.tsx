import React from 'react'
import ReactLoading from 'react-loading';
import Button from '../../common/button';
import {
  ChargeIcon,
  BrickIcon,
  LumberIcon,
  ConcreteIcon,
  SteelIcon
} from '../../common/icons/nft';
import useGetSetting from '../../../hooks/nft-game/axios/useGetSetting';
import { validateItemDate } from '../../../utils/helpers/validator';
import { useGlobalContext } from '../../../context/GlobalContext';

interface YieldUpgradeCostProps {
  color: string
  btnLabel: string
  onPurcharse: Function
  disabled?: boolean
  isLoading?: any
  type: string
  item: any
  colorType: number
}

export default function YieldUpgradeCost({
  onPurcharse,
  disabled,
  isLoading,
  type,
  item,
  colorType,
  color,
  btnLabel = '',
}: YieldUpgradeCostProps) {
  const { theme } = useGlobalContext();
  const {
    oneDayTime
  } = useGetSetting()
  const disabledIcons = [
    <ChargeIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <LumberIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <BrickIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <ConcreteIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <SteelIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />
  ]
  const activeIcons = [
    <ChargeIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <LumberIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <BrickIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <ConcreteIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />,
    <SteelIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263238"} />
  ]
  const cost = validateItemDate(item, oneDayTime) ?
    (item.name == 'Garden' ? item.buy :
      (item.name == 'Trees' ? item.buy : item.sell)) : item.buy

  const yieldCostContent = [];

  if (cost[1]) {
    yieldCostContent.push((
      <div className={`min-w-[20px] font-semibold mt-1 text-[14px] ${color}`}>
        {item.buy[1]} LAND
      </div>
    ))
  }
  cost.slice(2, 7).map((cost: number, index: number) => {
    if (Number(cost) > 0)
      yieldCostContent.push((
        <div key={`next-cost-${index}`}
          className={`min-w-[20px] font-semibold mt-1 text-[14px] ${color} ${item.name == 'Finished Basement' ? 'fs-13' : ''}`}>
          {colorType == 0 ? (
            <>
              {`${Number(cost)} `}
              {disabledIcons[index]}
            </>
          ) : (
            <>
              {`${Number(cost)} `}
              {activeIcons[index]}
            </>
          )}
        </div>
      ));
  });
  cost.slice(2, 7).map((cost: number, index: number) => {
    if (Number(cost) <= 0)
      yieldCostContent.push((
        <div key={`next-empty-${index}`} className='min-w-[20px]'>
        </div>
      ));
  })

  return (
    <div className={`flex flex-col w-full h-[130px] rounded-[25px] bg-[#ffffff] relative bg-primary ${color}`}>
      <div className='flex flex-col text-[14px] px-[10px]'>
        {((colorType < 2) || (btnLabel != 'SALVAGE')) ? (
          <div className='flex items-center'>
            <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] dark:text-text-secondary'>Yield: </span>
            <div className='status-value'>
              <span className={`font-semibold text-[12px] text-[#323131] mr-[4px] dark:text-text-primary ${color}`}>
                +{item.buyReward[9]}
              </span>
              <span className={`text-[8px] font-semibold dark:text-text-secondary ${color}`}> Multiplier</span>
              <span className='font-semibold text-[9px] leading-[18px] ml-[2px] text-[#323131] dark:text-text-secondary'> /year</span>
            </div>
          </div>
        ) : (
          <div className='flex items-center'>
            <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] dark:text-text-secondary'>Receive: </span>
            <div className='status-value w-full'>
              <div className='flex justify-start gap-1'>
                {item.sellReward.slice(2, 7).map((cost: number, index: number) => {
                  if (Number(cost) > 0)
                    return (
                      <div key={`next-cost-${index}`} className={`min-w-[20px] font-semibold mt-1 text-[14px] dark:text-text-primary ${color}`}>
                        {colorType == 0 ? (
                          <>
                            {`${Number(cost)} `}
                            {disabledIcons[index]}
                          </>
                        ) : (
                          <>
                            {`${Number(cost)} `}
                            {activeIcons[index]}
                          </>
                        )}
                      </div>
                    )
                })}
              </div>
            </div>
          </div>
        )}
        <div className="border-b-[1px] border-[#00000050] w-full my-1"></div>
      </div>
      <div className='flex items-center text-[14px] px-[10px]'>
        <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] dark:text-text-secondary'>Cost: </span>
        <div className='status-value w-full dark:text-text-primary'>
          <div className='flex justify-between'>
            {yieldCostContent.map((costContent, index) => (
              <div key={`show-cost-${index}`}>{costContent}</div>
            ))}
          </div>
        </div>
      </div>
      <Button
        onClick={() => onPurcharse()}
        className={`w-full bottom-[-1px] h-[45px] text-[18px] font-semibold absolute  ${((isLoading.type > -1) && (isLoading.type != type)) ? 'grey' : color} ${((isLoading.type == type) && isLoading.loading) ? 'flex justify-center items-center' : ''}`}
        disabled={disabled || ((isLoading.type == type) && isLoading.loading) || ((isLoading.type > -1) && (isLoading.type != type))}
      >
        {((isLoading.type == type) && isLoading.loading) ? (
          <>
            <ReactLoading type="spin" className="mr-2 mb-[4px]" width="24px" height="24px" />
            <span className="font-semibold text-button-text-secondary">Loading</span>
          </>
        ) : (
          <span className="font-semibold text-button-text-secondary">{btnLabel}</span>
        )}
      </Button>
    </div>
  )
}
