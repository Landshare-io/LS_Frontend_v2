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
import { useGlobalContext } from '../../../context/GlobalContext';

interface ProductionUpgradeCostProps {
  color: string
  btnLabel: string
  onPurcharse: Function
  disabled?: boolean
  isLoading?: any
  type: string
  item: any
  colorType: number
}

export default function ProductionUpgradeCost({
  color,
  btnLabel,
  onPurcharse,
  disabled,
  isLoading,
  type,
  item,
  colorType,
}: ProductionUpgradeCostProps) {
  const { theme } = useGlobalContext();
  const disabledIcons = [
    // <ChargeIcon className="" iconColor='#00000080' />,
    <ChargeIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263b28"} />,
    <LumberIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263b28"} />,
    <BrickIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263b28"} />,
    <ConcreteIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263b28"} />,
    <SteelIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263b28"} />
  ]
  const activeIcons = [
    <ChargeIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263b28"} />,
    <LumberIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263b28"} />,
    <BrickIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263b28"} />,
    <ConcreteIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263b28"} />,
    <SteelIcon className="" iconColor={theme == 'dark' ? "#cbcbcb" : "#263b28"} />
  ]

  return (
    <div className={`flex flex-col w-full h-[130px] rounded-[25px] bg-[#fff] relative bg-primary ${color}`}>
      <div className='flex flex-col px-2'>
        {type == 'toolshed' && (
          <div className='flex items-center justify-between'>
            {item.buyReward.slice(2, 7).map((percent: number, index: number) => {
              if (Number(percent) > 0) {
                return (
                  <div key={`reduction-percent-${index}`}>
                    <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] dark:text-text-secondary'>{disabledIcons[index]} repair: </span>
                    <span className='font-semibold text-[14px] text-[#323131] text-text-primary'>{`-${percent * 100}%`}</span>
                  </div>
                )
              }
            })}
          </div>
        )}
        {type == 'overdrive' && (
          <div className='flex items-center justify-between'>
            {item.reductionPercent.map((percent: number, index: number) => {
              if (Number(percent) > 0) {
                return (
                  <div key={`reduction-percent-${index}`}>
                    <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] dark:text-text-secondary'>{disabledIcons[index]} Increase Production: </span>
                    <span className='font-semibold text-[14px] text-[#323131] text-text-primary'>{`${percent}%`}</span>
                  </div>
                )
              }
            })}
          </div>
        )}
        {type == 'fatification' && (
          <div className='flex justify-between'>
            <div>
              <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] dark:text-text-secondary'>Durability: </span>
              <span className='font-semibold text-[14px] text-[#323131] dark:text-text-primary'>{item.buyReward[7] * 100}%</span>
            </div>
            {item.buyReward[8] && (
              <div>
                <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] dark:text-text-secondary'>Max Durability: </span>
                <span className='font-semibold text-[14px] text-[#323131] dark:text-text-primary'>{100 + item.buyReward[8] * 100}%</span>
              </div>
            )}
          </div>
        )}
        {type == 'harvester' && (
          <div className='flex justify-start'>
            <div>
              <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] dark:text-text-secondary'>Harvest Cost: </span>
              <span className='font-semibold text-[14px] text-[#323131] dark:text-text-primary'>-{item.buyReward[11] * 100}%</span>
            </div>
          </div>
        )}
        {type == 'concreteFoundation' && (
          <div className='flex justify-start'>
            <div>
              <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] dark:text-text-secondary'>Durability Loss: </span>
              <span className='font-semibold text-[14px] text-[#323131] dark:text-text-primary'>{`-${item.buyReward[7] * 100}`}%</span>
            </div>
          </div>
        )}
        {type == 'Generator' && (
          <div className='flex justify-start'>
            <div>
              <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] dark:text-text-secondary'>Repair Power Cost: </span>
              <span className='font-semibold text-[14px] text-[#323131] text-text-primary'>{`-${item.buyReward[2] * 100}`}%</span>
            </div>
          </div>
        )}
        <div className="border-b-[1px] border-[#00000050] w-full my-2"></div>
      </div>
      <div className='flex pb-3 items-center px-2'>
        <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] dark:text-text-secondary'>Cost: </span>
        <div className='status-value w-full text-text-primary'>
          <div className='flex justify-between'>
            {item.buy.slice(2, 7).map((cost: number, index: number) => {
              if (Number(cost) > 0)
                return (
                  <div key={`next-cost-${index}`} className={`min-w-[20px] text-[14px] flex gap-[2px] items-center`}>
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
        className={`w-full bottom-[-1px] h-[45px] text-[18px] font-semibold absolute rounded-[20px] ${((isLoading.type > -1) && (isLoading.type != type)) ? 'grey' : color} ${((isLoading.type == type) && isLoading.loading) ? 'flex justify-center items-center' : ''}`}
        disabled={disabled || ((isLoading.type == type) && isLoading.loading) || ((isLoading.type > -1) && (isLoading.type != type))}
      >
        {((isLoading.type == type) && isLoading.loading) ? (
          <>
            <ReactLoading type="spin" className="me-2 mb-[4px]" width="24px" height="24px" />
            <span className="font-semibold text-button-text-secondary">Loading</span>
          </>
        ) : (
          <span className="font-semibold text-button-text-secondary">{btnLabel}</span>
        )}
      </Button>
    </div>
  )
}
