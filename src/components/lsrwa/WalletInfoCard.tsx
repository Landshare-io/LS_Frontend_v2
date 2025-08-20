'use client';

import { useEffect, useState } from 'react';
import { useBalance, useAccount, useChainId, useDisconnect } from "wagmi";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DepositForm from './DepositForm';
import ConnectWallet from '../connect-wallet';
import Modal from "react-modal";
import { USDC_ADDRESS } from "@/config/constants/environments";
import numeral from "numeral";
import { formatUnits } from 'ethers';

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflow: "auto",
    maxWidth: "600px",
    width: "fit-content",
    height: "fit-content",
    borderRadius: "20px",
    padding: 0,
  },
  overlay: {
    zIndex: 99999,
    background: "#00000080",
  },
};

export default function WalletInfoCard() {

  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  const chainId = useChainId()

  const {
    data: usdcBalance,
  } = useBalance({
    address: address,
    token: USDC_ADDRESS[chainId],
    chainId: chainId,
  }) as { data: any, isPending: any, refetch: any };

  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState(false)
  const [balance, setBalance] = useState(0)
  const router = useRouter();

  useEffect(() => {
    if (usdcBalance) {
      setBalance(Number(usdcBalance?.value ? numeral(formatUnits(usdcBalance.value, 6)).format("0.[000]") : '0.0'));
    }
  }, [usdcBalance])

  const handleDepositClick = () => {
    setOpen(true)
  };
  const handleWithdrawClick = () => {
    // router.push('/withdraw');
  };
  const handleSwapClick = () => {
    // router.push('/swap');
  };
  const handleDisplayClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="relative bg-gradient-to-b from-[#61CD81] to-[#239942] rounded-[20px] shadow-[1px_3px_4px_0px_rgba(0,0,0,0.15)] p-[24px] text-white">
      <div className="relative w-max">
        <button type="button" id="dropdownToggle"
          onClick={handleDisplayClick}
          className="flex gap-2 items-center bg-[#61CD81] px-[4px] py-[2px] rounded-full text-white text-base font-medium  cursor-pointer">
          <Image
            src="/icons/contract.png"
            alt="contract"
            width={24}
            height={24}
            priority
          />
          {isConnected && (<p>{(address as any).slice(0, 6)}...{(address as any).slice(-4)}</p>)}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-white inline ml-3" viewBox="0 0 24 24">
            <path fillRule="evenodd"
              d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
              clipRule="evenodd" data-original="#000000" />
          </svg>
        </button>

        <ul id="dropdownMenu" className={`absolute ${isVisible ? '' : 'hidden'} [box-shadow:0_8px_19px_-7px_rgba(6,81,237,0.2)] bg-white py-2 z-[2] min-w-full w-max divide-y divide-gray-300 max-h-96 overflow-auto`}>
          <li className="dropdown-item py-2.5 px-5 flex items-center hover:bg-slate-100 text-slate-900 text-sm cursor-pointer" onClick={() => disconnect()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4 mr-3"
              viewBox="0 0 6.35 6.35">
              <path
                d="M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663 2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z"
                data-original="#000000"></path>
            </svg>
            Disconnect
          </li>
        </ul>

      </div>
      <p className='text-[14px] leading-[22px] mt-6'>Your Balance</p>
      <p className='text-[46px] leading-[56px]'>{isConnected ? balance : 0}</p>
      <div className=' flex  w-max gap-1 items-center bg-[#61CD81] px-[9px] py-[3px] rounded-full text-white'>
        <Image
          src="/icons/invest_hand.png"
          alt="contract"
          width={14}
          height={14}
          priority
        />
        <label htmlFor="">+123$</label>
        <label htmlFor="">(10.53%)</label>
      </div>
      <div className='mt-6 flex justify-center items-center md:h-[133px] w-full md:px-2 border border-solid border-transparent rounded-[15px] md:bg-linearGradientCard'
      >
        <div className='flex flex-col md:flex-row justify-between md:w-[400px] w-full  gap-2 md:gap-0'>
          <button type='button' className="flex flex-row-reverse justify-between p-[10px] w-full rounded-[15px] border-[1px] border-solid border-[#ffffff4d]  bg-linearGradientCard md:justify-center md:p-0 md:w-fit md:bg-none md:border-0 md:flex-col items-center group" onClick={handleDepositClick}>
            <div className="w-[64px] h-[64px] rounded-full bg-green flex items-center justify-center transition-colors duration-300 group-hover:bg-[#131B3F] overflow-hidden">
              <Image
                src="/icons/plus.png"
                alt="Plus"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <span className="font-medium text-white">Deposit</span>
          </button>
          <button className="flex flex-row-reverse justify-between p-[10px] w-full rounded-[15px] border-[1px] border-solid border-[#ffffff4d]  bg-linearGradientCard md:justify-center md:p-0 md:w-fit md:bg-none md:border-0 md:flex-col items-center group" onClick={handleWithdrawClick}>
            <div className="w-[64px] h-[64px] rounded-full bg-green flex items-center justify-center transition-colors duration-300 group-hover:bg-[#131B3F] overflow-hidden">
              <Image
                src="/icons/down.png"
                alt="Plus"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <span className="font-medium text-white">Withdraw</span>
          </button>
          <button className="flex flex-row-reverse justify-between p-[10px] w-full rounded-[15px] border-[1px] border-solid border-[#ffffff4d]  bg-linearGradientCard md:justify-center md:p-0 md:w-fit md:bg-none md:border-0 md:flex-col items-center group" onClick={handleSwapClick}>
            <div className="w-[64px] h-[64px] rounded-full bg-green flex items-center justify-center transition-colors duration-300 group-hover:bg-[#131B3F] overflow-hidden">
              <Image
                src="/icons/swap.png"
                alt="Plus"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <span className="font-medium text-white">Harvest Interest</span>
          </button>
        </div>
      </div>
      {!isConnected && (
        <div className='absolute top-0 left-0 w-full h-full bg-white/50 backdrop-blur-sm z-[100]'>
          <div className=' w-full h-full flex flex-col items-center justify-center'>
            <div className='rounded-full'>
              <Image
                src="/icons/lock_frame.svg"
                alt="Lock"
                width={50}
                height={50}
                priority
              />
            </div>
            <div className='text-white text-[14px] mt-[6px]'>
              To unlock, connect your wallet
            </div>
            <div className='mt-[14px]'>
              <ConnectWallet connectButtonClassName="flex gap-4 w-[257px] h-[60px] bg-green text-white rounded-[100px] bg-white font-bold text-[14px] !text-black " />
            </div>
          </div>
        </div>
      )}
      <Modal isOpen={open} onRequestClose={() => setOpen(false)} style={customModalStyles}
        contentLabel="Modal">
        <div className="bg-secondary px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className='flex justify-end w-full' onClick={() => setOpen(false)}>
            <Image
              src="/icons/close.svg"
              alt="close Modal"
              width={12}
              height={12}
              priority
            />
          </div>
          <DepositForm />
        </div>
      </Modal>

    </div>
  );
}
