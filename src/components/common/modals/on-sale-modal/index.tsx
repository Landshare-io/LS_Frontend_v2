import React, { useState } from 'react';
import ReactModal from 'react-modal';
import ReactLoading from 'react-loading';
import Button from '../../button';

interface OnSaleModalProps {
  modalShow: boolean, 
  setModalShow: Function, 
  multiplier: string | number, 
  rewardedToken: string | number, 
  onSubmit: Function, 
  onSaleLoading: boolean
}

export default function OnSaleModal ({ modalShow, setModalShow, multiplier, rewardedToken, onSubmit, onSaleLoading }: OnSaleModalProps) {
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState('');

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

  const onSale = (e: any) => {
    e.preventDefault();
    if (price && Number(price) != 0) {
      if (Number(price) % 1 == 0) {
        onSubmit(price);
        setPriceError("");
      } else {
        setPriceError("Price should be a integer value.");
      }
    } else {
      setPriceError("Please input selling price.");
    }
  }

  return (
    <ReactModal
      style={customModalStyles}
      isOpen={modalShow}
      onRequestClose={() => { setModalShow(!modalShow), document.body.classList.remove('modal-open'); }}
    >
      <div className='modal-header-content p-3 heading mt-3'>
        On-Sale
      </div>
      <div className='px-3 mb-3'>
        <div>
          <div className="mb-3">
            <label className="ps-1">Price</label>
            <input 
              type="number"
              step="1"
              min="0"
              placeholder="Price" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {priceError && (
              <text className="text-danger">
                {priceError}
              </text>
            )}
          </div>
          <div className="mb-1 px-1">
            <label className="me-2">Current Multiplier: </label>
            <label>{multiplier}</label>
          </div>
          <div className="mb-3 px-1">
            <label className="me-2">Token Rewarded: </label>
            <label>{rewardedToken}</label>
          </div>

          <div 
            className="items-center flex my-auto ms-0 justify-end"
          >
            <Button
              className="flex flex-col justify-center items-center"
              disabled={onSaleLoading}
              onClick={onSale}
            >
              {onSaleLoading ? (
                <ReactLoading
                type="spin"
                className="me-2 button-spinner"
                width="24px"
                height="24px"
              />
              ) : (
                <span className="fs-16">Confirm</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </ReactModal>
  )
}
