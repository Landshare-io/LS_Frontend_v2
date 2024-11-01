import React, { useState } from 'react';
import ReactLoading from "react-loading";
import ReactModal from 'react-modal';
import Button from '../../button';

interface MintModalProps {
  title: string,
  show: boolean,
  setShow: Function,
  minAmount: number,
  onSubmit: Function
}

export default function MintModal({ title, show, setShow, minAmount, onSubmit }: MintModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [landAmount, setLandAmount] = useState(0);
  const [assetError, setAssetError] = useState('');
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

  const handleAction = async () => {
    if (Number(landAmount * 4) < Number(minAmount)) {
      return setAssetError(`Land token amount should be more than ${minAmount / 4}`)
    } else {
      setIsLoading(true);
      await onSubmit(landAmount);
      setShow(false);
      setIsLoading(false);
    }
  }

  return (
    <ReactModal
      style={customModalStyles}
      isOpen={show}
      onRequestClose={() => { setShow(!show), document.body.classList.remove('modal-open'); }}
    >
      <div className='p-3 text-[25px] text-[#000]'>
        {title}
      </div>
      <div className='px-3 mb-3'>
        <div className="mb-3">
          <label>Extend Land Amount</label>
          <input 
            type="number"
            value={landAmount}
            onChange={(e: any) => setLandAmount(e.target.value)}
            min={minAmount}
          />
          {assetError && (
            <span className="text-danger">
              {assetError}
            </span>
          )}
        </div>

        <div className="items-center flex my-auto ml-0 justify-between">
          <span className='pl-[1px]'>Fee amount: {landAmount / 100 * 8} Land</span>
          <Button
            className="flex justify-center items-center"
            onClick={handleAction}
            disabled={isLoading || ((landAmount * 4) < Number(minAmount))}
          >
            {isLoading ? (
              <>
                <ReactLoading
                  type="spin"
                  className="mr-2 mb-[4px]"
                  width="24px"
                  height="24px"
                />
                <span className="font-semibold">Loading</span>
              </>
            ) : (
              <span className="text-[16px]">{landAmount * 4} NFT Credits</span>
            )}
          </Button>
        </div>
      </div>
    </ReactModal>
  )
}
