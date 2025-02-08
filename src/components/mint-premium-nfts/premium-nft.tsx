import React, { useState } from 'react';
import ReactLoading from "react-loading";
import Image from 'next/image';
import ReactModal from 'react-modal';
import { OpenModalIcon } from "../common/icons/index";
import Button from '../common/button';
import { useGlobalContext } from '../../context/GlobalContext';

interface PremiumNftProps {
  amountMinted: number;
  premiumNft: any;
  mintCap: number;
  onSubmit: Function;
  loader: string;
}

export default function PremiumNft({ amountMinted, premiumNft, mintCap, onSubmit, loader }: PremiumNftProps) {
  const { theme } = useGlobalContext();
  const [openModal, setOpenModal] = useState(false);

  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflow: "hidden",
      maxWidth: "400px",
      width: "90%",
      height: "fit-content",
      borderRadius: "20px",
      padding: 0,
      border: 0
    },
    overlay: {
      background: '#00000080'
    }
  };

  return (
    <>
      <div className="flex flex-col animate-[fadeIn] duration-1200 rounded-[15px] overflow-hidden min-w-[257px]">
        <div className='bg-gradient-to-b from-[#68819D] to-[#4da3a942]'>
          <div className="flex flex-col items-center justif-center bg-[#00000033] h-[49px] py-[8px]">
            <span className="font-semibold text-white text-[20px]">{premiumNft.name}</span>
          </div>
          <div className='w-full h-[210px] relative'>
            <Image
              src={premiumNft.imgSrc}
              alt={premiumNft.name}
              className="translate-x-[-50%] w-[210px] h-[210px] left-[50%] top-0 absolute"
            />
            <div className="flex absolute items-end w-full justify-between px-3 bottom-[5px]">
              <div className="text-[#fff] text-[14px] font-semibold align-text-bottom leading-[18px]">
                Minted: {Number(amountMinted) ?? 0} / Limit {Number(mintCap) ?? 0}
              </div>
              <div>
                <div onClick={() => setOpenModal(true)}>
                  <OpenModalIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#6f8e9d66] py-[13px] px-[12px]">
          <div className='flex flex-col w-full h-[130px] rounded-[25px] bg-[#fff] bg-primary relative border-[2px] border-[#61cd81]'>
            <div className='flex flex-col px-2'>
              <div className='flex justify-between pt-[12px]'>
                <div>
                  <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] text-text-secondary'>Multiplier: </span>
                  <span className={`${theme == 'dark' ? "text-[#cec9c9]" : "text-[#323131]"} text-[12px] font-[600] mr-[4px]`}>+{premiumNft.multiplier}</span>
                  <span className={`${theme == 'dark' ? "text-[#cec9c9]" : "text-[#323131]"} text-[9px] font-[600]`}> /Item</span>
                </div>
                <div>
                  <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] text-text-secondary'>Refurbish Cost: </span>
                  <span className={`${theme == 'dark' ? "text-[#cec9c9]" : "text-[#323131]"} text-[12px] font-[600] mr-[4px]`}>5</span>
                  <span className={`${theme == 'dark' ? "text-[#cec9c9]" : "text-[#323131]"} text-[9px] font-[600]`}>LAND</span>
                </div>
              </div>
              <div className="border-b-[1px] border-[#00000050] w-full my-2"></div>
            </div>
            <div className='flex pb-3 items-center px-2'>
              <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] text-text-secondary'>Cost: </span>
              <div className='w-full'>
                <div className='min-w-[20px] font-semibold ml-1 text-[14px]'>
                  {premiumNft.price} LAND
                </div>
              </div>
            </div>
            <Button
              onClick={() => onSubmit()}
              className={`w-full bottom-[-1px] h-[45px] text-[18px] bg-[#61cd81] font-semibold absolute disabled:text-text-secondary dark:disabled:bg-[#51616b]  disabled:opacity-60 rounded-[20px] ${(loader == premiumNft.name) ? 'flex justify-center items-center' : ''}`}
              disabled
            >
              {(loader == premiumNft.name) ? (
                <div className='flex justify-center items-center'>
                  <ReactLoading type="spin" className="mr-2 mb-[4px]" width="24px" height="24px" />
                  <span className="font-semibold">Loading</span>
                </div>
              ) : (
                <span className="font-semibold">Mint</span>
              )}
            </Button>
          </div>
        </div>
      </div>
      {premiumNft.infoText && (
        <ReactModal
          style={customModalStyles}
          isOpen={openModal}
          onRequestClose={() => { setOpenModal(!openModal), document.body.classList.remove('modal-open'); }}
          className='outline-none'
          overlayClassName='fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm'
        >
          <div className='relative bg-white dark:bg-[#2e3740] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 max-w-xs w-full m-auto'>
            <button
              onClick={() => setOpenModal(false)}
              className='absolute top-3 right-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-white transition-colors duration-200 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700'
              aria-label='Close'
            >
              ✕
            </button>
            <div className='text-sm text-gray-700 dark:text-gray-200 text-center leading-relaxed mt-2'>
              <span className="my-2 mx-3 text-[14px]">{premiumNft.infoText}</span>
            </div>
          </div>
        </ReactModal>
      )}
    </>
  );
}
