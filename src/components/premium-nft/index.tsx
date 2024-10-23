import React, { useState } from 'react';
import ReactLoading from "react-loading";
import Button from '../common/button';

interface PremiumNftProps {
  premiumNft: any
  onSubmit: any
  loader: string
}

export default function PremiumNft({
  premiumNft,
  onSubmit,
  loader,
}: PremiumNftProps) {
  const [price, setPrice] = useState(0)

  return (
    <>
      <div className="flex flex-col rounded-[15px] overflow-hidden w-[257px] animate-[fadeIn]">
        <div className='bg-gradient-to-b from-[#68819D] to-[4da3a942]'>
          <div className="flex flex-col items-center justify-center bg-[#00000033] h-[49px] py-[8px] px-0">
            <span className="font-semibold text-[20px] text-[#fff]">{premiumNft.name} #{premiumNft.onChainId}</span>
          </div>
          <div className='w-full h-[210px] relative'>
            <img
              src={premiumNft.imgSrc}
              alt={premiumNft.name}
              className="translate-x-[-50%] translate-y-0 w-[210px] h-[210px] top-0 left-[50%] absolute"
            />
          </div>
        </div>
        <div className="bg-[#6f8e9d66] py-[13px] px-[12px]">
          <div className={`flex flex-col w-full h-[130px] rounded-[25px] bg-[#fff] !h-[128px] relative bg-primary 
            ${premiumNft.marketplaceItem !== -1 ? "border-[2px] border-[#ec9821]" : "border-[2px] border-[#61cd81]"}`}>
            <div className='flex flex-col px-2'>
              <div className='flex justify-between'>
                <div>
                  <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] dark:text-text-secondary'>Multiplier: </span>
                  <span className='font-semibold text-[12px] text-[#323131] mr-[4px] dark:text-text-primary'>+{premiumNft.multiplier}</span>
                  <span className="font-semibold text-[9px] leading-[18px] text-[#323131] ml-[2px] dark:text-text-secondary"> /Item</span>
                </div>
                <div>
                  <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] text-text-secondary'>Refurbish Cost: </span>
                  <span className='font-semibold text-[12px] text-[#323131] mr-[4px] text-text-primary'>5</span>
                  <span className="font-semibold text-[9px] leading-[18px] text-[#323131] ml-[2px]  text-text-secondary">LAND</span>
                </div>
              </div>
              <div className="border-b-[1px] border-[#00000050] w-full my-2"></div>
              <div className="flex items-center justify-between">
                <span className="text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] text-[10px] font-semibold dark:text-text-secondary">Sale Price: </span>
                <input
                  className="text-[0.8rem] max-w-[70px] border-[1px] border-[#8d8d8d] rounded-[5px] text-right pr-[5px] pl-[5px] text-[#000] mr-1 "
                  type="number"
                  step="1"
                  min={Number(price)}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
            </div>
            <Button
              onClick={() => onSubmit(premiumNft, price)}
              className={`w-full bottom-[-1px] h-[45px] text-[18px] font-semibold absolute 
                ${premiumNft.marketplaceItem !== -1 ? 'bg-[#ec9821] border-[2px] border-[#ec9821]' : ''}
                ${(loader == `${premiumNft.id}-${premiumNft.onChainId}`) ? 'flex justify-center items-center' : ''}`}
                disabled
            //</div>={loader == `${premiumNft.id}-${premiumNft.onChainId}`}
            >
              {(loader == `${premiumNft.id}-${premiumNft.onChainId}`) ? (
                <>
                  <ReactLoading type="spin" className="mr-2 mb-[4px]" width="24px" height="24px" />
                  <span className="font-semibold">Loading</span>
                </>
              ) : (<span className="font-semibold text-button-text-secondary">{premiumNft.marketplaceItem !== -1 ? 'Set off-sale' : 'Set On Sale'}</span>)
              }
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
