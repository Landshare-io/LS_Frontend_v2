import React, { useState } from 'react';
import ReactLoading from "react-loading";
import ReactModal from 'react-modal';
import { OpenModalICon } from "../common/icons/index";
import { useGlobalContext } from '../../context/GlobalContext';

interface PremiumNftProps {
  amountMinted: number;
  premiumNft: any;
  mintCap: number;
  onSubmit: Function;
  loader: boolean;
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
      <div className="d-flex flex-column addon cards-hover-animation">
        <div className='addon-header'>
          <div className="d-flex flex-column align-items-center justify-content-center addon-head">
            <span className="addon-label">{premiumNft.name}</span>
          </div>
          <div className='addon-status position-relative'>
            <img
              src={premiumNft.imgSrc}
              alt={premiumNft.name}
              className="addon-img position-absolute"
            />
            <div className="d-flex position-absolute align-items-end w-100 justify-content-between px-3 addon-current-yield">
              <div className="current-minted-status">
                Minted: {amountMinted ?? 0} / Limit {mintCap ?? 0}
              </div>
              <div className="addon-svg">
                <div onClick={() => setOpenModal(true)}>
                  <OpenModalICon />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="yield-upgrade-cost">
          <div className='d-flex flex-column w-100 buy-or-upgrade-section bg-tw-primary  position-relative green'>
            <div className='d-flex flex-column px-2'>
              <div className='d-flex justify-content-between'>
                <div className='status-value'>
                  <span className='status-label text-tw-text-secondary'>Multiplier: </span>
                  <span className={`${theme == 'dark' ? "text-[#cec9c9]" : "text-[#323131]"} text-[12px] font-[600] mr-[4px]`}>+{premiumNft.multiplier}</span>
                  <span className={`${theme == 'dark' ? "text-[#cec9c9]" : "text-[#323131]"} text-[9px] font-[600]`}> /Item</span>
                </div>
                <div className='status-value'>
                  <span className='status-label text-tw-text-secondary'>Refurbish Cost: </span>
                  <span className={`${theme == 'dark' ? "text-[#cec9c9]" : "text-[#323131]"} text-[12px] font-[600] mr-[4px]`}>5</span>
                  <span className={`${theme == 'dark' ? "text-[#cec9c9]" : "text-[#323131]"} text-[9px] font-[600]`}>LAND</span>
                </div>
              </div>
              <div className="divider w-100 my-2"></div>
            </div>
            <div className='d-flex pb-3 align-items-center px-2'>
              <span className='status-label text-tw-text-secondary'>Cost: </span>
              <div className='status-value w-100'>
                <div className='next-cost-icons fw-600 ms-1 yield-cost-value green'>
                  {premiumNft.price} LAND
                </div>
              </div>
            </div>
            <button
              onClick={() => onSubmit()}
              className={`btn nav-btn w-100 buy-or-upgrade-btn position-absolute  ${(loader == premiumNft.name) ? 'd-flex justify-content-center align-items-center' : ''}`}
              disabled //={(loader == premiumNft.name)}
            >
              {(loader == premiumNft.name) ? (
                <>
                  <ReactLoading type="spin" className="me-2 button-spinner" width="24px" height="24px" />
                  <span className="upgrade-status">Loading</span>
                </>
              ) : (
                <span className="upgrade-status">Mint</span>
              )}
            </button>
          </div>
        </div>
      </div>
      {premiumNft.infoText && (
        <ReactModal
          style={customModalStyles}
          isOpen={openModal}
          onRequestClose={() => { setOpenModal(!openModal), document.body.classList.remove('modal-open'); }}
        >
          <div className="d-flex min-h-100 justify-content-center align-items-center">
            <span className="my-2 mx-3 fs-14 fw-400">{premiumNft.infoText}</span>
          </div>
        </ReactModal>
      )}
    </>
  );
}
