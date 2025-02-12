import React, { useState } from 'react';
import ReactLoading from "react-loading";
import Image from "next/image";
import ReactModal from 'react-modal';
import { OpenModalIcon } from "../../common/icons/index";
import Button from '../../common/button';
import { useTheme } from "next-themes";
import { returnPremiumNftRemainTime } from "../../../utils/helpers/validator";

interface PremiumNftProps {
  premiumNft: any;
  onSubmit: Function;
  loader: string;
}

export default function PremiumNft({
  premiumNft,
  onSubmit,
  loader,
}: PremiumNftProps) {
  const { theme } = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const remainingTime = returnPremiumNftRemainTime(premiumNft.activeTime)

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
            <div className="flex absolute items-end w-full justify-center px-3 text-center top-[5px] text-[10px]">
              <div className="text-[14px] text-[#fff] font-semibold leading-[24px] z-10">
                {remainingTime ? `Next Refurbish: ${remainingTime}` : ''}
              </div>
            </div>
            <Image
              src={premiumNft.imgSrc}
              alt={premiumNft.name}
              className="translate-x-[-50%] w-[210px] h-[210px] left-[50%] top-0 absolute"
            />
            <div className="flex absolute items-end w-full justify-between px-3 bottom-[5px]">
              <div className="text-[#fff] text-[14px] font-semibold align-text-bottom leading-[18px]">
                Installed: {premiumNft.backendItems?.length ?? 0} / {premiumNft.onChainItems?.length ?? 0}
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
          <div className={`flex flex-col w-full h-[95px] rounded-[25px] bg-[#fff] bg-primary relative border-[2px] pt-[12px]
            ${premiumNft.hasNft ? "border-[2px] border-[#f1b258] bg-[#f1b258]" : "border-[2px] border-[#61cd81] bg-[#61cd81]"}`}>
            <div className='flex flex-col px-2'>
              <div className='flex justify-start'>
                <div>
                  <span className='text-[#6f8e9d] font-semibold text-[10px] ml-[4px] pr-[2px] text-text-secondary'>Multiplier: </span>
                  <span className={`${theme == 'dark' ? "text-[#cec9c9]" : "text-[#323131]"} text-[12px] font-[600] mr-[4px]`}>+{premiumNft.multiplier}</span>
                  <span className={`${theme == 'dark' ? "text-[#cec9c9]" : "text-[#323131]"} text-[9px] font-[600]`}> /Item</span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => onSubmit()}
              className={`w-full bottom-[-1px] h-[45px] text-[18px] bg-[#61cd81] font-semibold absolute rounded-[20px] 
              ${premiumNft.hasNft ? 'border-[2px] border-[#f1b258] bg-[#f1b258]' : ''}
              ${(loader == premiumNft.name) ? 'flex justify-center items-center' : ''}`}
              textClassName='text-white'
              disabled={loader == premiumNft.name}
            >
              {(loader == premiumNft.name) ? (
                <div className='flex justify-center items-center'>
                  <ReactLoading type="spin" className="me-2 mb-[4px]" width="24px" height="24px" />
                  <span className="font-semibold">Loading</span>
                </div>
              ) : (<span className="font-semibold">{premiumNft.hasNft ? 'UNINSTALL' : 'INSTALL'}</span>)
              }
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
