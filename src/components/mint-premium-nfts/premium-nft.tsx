import React, { useState } from 'react';
import ReactLoading from "react-loading";
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
      <div className="flex flex-col animate-[fadeIn] duration-1200 rounded-[15px] overflow-hidden w-[257px]">
        <div className='bg-gradient-to-b from-[#68819D] to-[#4da3a942]'>
          <div className="flex flex-col items-center justif-center bg-[#00000033] h-[49px] py-[8px]">
            <span className="font-semibold text-white text-[20px]">{premiumNft.name}</span>
          </div>
          <div className='w-full h-[210px] relative'>
            <img
              src={premiumNft.imgSrc}
              alt={premiumNft.name}
              className="translate-x-[-50%] w-[210px] h-[210px] left-[50%] top-0 absolute"
            />
            <div className="flex absolute items-end w-full justify-between px-3 bottom-[5px]">
              <div className="text-[#fff] text-[14px] font-semibold align-text-bottom leading-[18px]">
                Minted: {amountMinted ?? 0} / Limit {mintCap ?? 0}
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
              <div className='flex justify-between'>
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
                <div className='min-w-[20px] font-semibold ml-1 text-[14px] font-normal text-[#00000080]'>
                  {premiumNft.price} LAND
                </div>
              </div>
            </div>
            <Button
              onClick={() => onSubmit()}
              className={`w-full bottom-[-1px] h-[45px] text-[18px] font-semibold absolute  ${(loader == premiumNft.name) ? 'flex justify-center items-center' : ''}`}
              disabled
            >
              {(loader == premiumNft.name) ? (
                <>
                  <ReactLoading type="spin" className="mr-2 mb-[4px]" width="24px" height="24px" />
                  <span className="font-semibold">Loading</span>
                </>
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
        >
          <div className="flex min-h-100 justify-center items-center">
            <span className="my-2 mx-3 text-[14px]">{premiumNft.infoText}</span>
          </div>
        </ReactModal>
      )}
    </>
  );
}
