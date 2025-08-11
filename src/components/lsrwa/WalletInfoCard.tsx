'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/lsrwa/useWallet';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import WalletConnectButton from './WalletConnectButton';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import DepositForm from './DepositForm';


export default function WalletInfoCard() {
  const {
    address,
    isConnected,
    disconnect,
    balance,
    symbol,
  } = useWallet();

  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(0)
  const router = useRouter();

  const handleDepositClick = () => {
    setOpen(true)
  };
  const handleWithdrawClick = () => {
    router.push('/withdraw');
  };
  const handleSwapClick = () => {
    router.push('/swap');
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
      <div className='mt-6 flex justify-center items-center h-[133px] w-full px-2 border border-solid border-transparent rounded-[15px]'
        style={{
          background: 'linear-gradient(90.37deg, rgba(255, 255, 255, 0.24) 0.16%, rgba(255, 255, 255, 0.12) 99.92%)',
          // borderWidth: '1px',
          // borderImageSource: 'linear-gradient(90.61deg, rgba(255, 255, 255, 0.3) 1.27%, rgba(255, 255, 255, 0.3) 100%)',
          // borderImageSlice: '1',
          // borderRadius: '15px'
        }}>
        <div className='flex justify-between md:w-[400px] w-full'>
          <button type='button' className="flex flex-col items-center group" onClick={handleDepositClick}>
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
          <button className="flex flex-col items-center group" onClick={handleWithdrawClick}>
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
          <button className="flex flex-col items-center group" onClick={handleSwapClick}>
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
              <WalletConnectButton class="bg-white py-[19px] px-[79px] font-bold text-[14px] !text-black" />
            </div>
          </div>
        </div>
      )}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

            <DialogPanel
              transition
              className="relative transform overflow-hidden  rounded-3xl bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
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
            </DialogPanel>
          </div>
        </div>
      </Dialog>

    </div>
  );
}
