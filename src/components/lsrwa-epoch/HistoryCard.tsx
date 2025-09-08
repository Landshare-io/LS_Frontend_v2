'use client';

import { useEffect, useState } from 'react';
import clsx from "clsx";
import { format } from 'date-fns';
import Image from 'next/image';
import { TRANSACTION_CONFIRMATIONS_COUNT } from "@/config/constants/environments";
import { useChainId, useWaitForTransactionReceipt } from 'wagmi';
import numeral from "numeral";
import useCancelDeposit from '@/hooks/contract/LSRWAEpoch/useCancelDeposit';
import useExcuteWithdraw from '@/hooks/contract/LSRWAEpoch/useExecuteWithdraw';
import { IoMdCheckmark } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { useGlobalContext } from "@/context/GlobalContext";
import { MAJOR_WORK_CHAINS } from '@/config/constants/environments';

const RWA_MAJOR_WORK_CHAIN = MAJOR_WORK_CHAINS['/rwa']


export default function HistoryCard({ isWithdraw, id, timestamp, amount, processed, fetchRequests, executed, fetchHistoryData, setFetchHistoryData }: any) {
  const [cancelling, setCancelling] = useState(false);
  const [receiving, setReceiving] = useState(false);
  const [requestStatus, setRequestStatus] = useState(0); // 0 : pending, 1 : completed, 2 : cancel
  const chainId = useChainId()
  const [supportChainStatus, setSupportChainStatus] = useState(true);

  const { notifyError } = useGlobalContext();

  const {
    cancelDeposit: excuteCancelDeposit,
    isError: isErrorVault,
    error: errorValut,
    data: dataVaultTx
  } = useCancelDeposit(chainId);

  const {
    executeWithdraw: executeWithdrawVault,
    isError: isErrorExecuteWithdraw,
    error: errorExecuteWithdraw,
    data: dataExecuteWithdrawTx
  } = useExcuteWithdraw(chainId);

  const { isSuccess: cancelDepositSuccess } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: dataVaultTx,
    chainId: chainId
  });

  const { isSuccess: executeWithdrawSuccess } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: dataExecuteWithdrawTx,
    chainId: chainId
  });

  useEffect(() => {
    const chainStatus = (RWA_MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId) ? true : false;
    setSupportChainStatus(chainStatus)
  }, [chainId])

  useEffect(() => {
    if (cancelDepositSuccess) {
      fetchRequests();
      setCancelling(false);
      setFetchHistoryData(!fetchHistoryData)

    }
  }, [cancelDepositSuccess])

  useEffect(() => {
    if (executeWithdrawSuccess) {
      fetchRequests();
      setReceiving(false);
    }
  }, [executeWithdrawSuccess])

  const cancelDeposit = async () => {

    if (supportChainStatus === false) {
      notifyError("Please switch your chain to Hardhat, Binance Smart Chain Testnet, Polygon Amoy, Arbitrum Sepolia")
      return;
    }

    setCancelling(true);
    excuteCancelDeposit(BigInt(id))
  }

  const executeWithdraw = async () => {
    if (isErrorExecuteWithdraw) {
      console.log('errorValut => ', errorExecuteWithdraw)
      notifyError("Transaction Failed.")
    } else {
      setReceiving(true);
      executeWithdrawVault(BigInt(id));
    }
  };

  useEffect(() => {
    if (isErrorVault) {
      notifyError("Transaction Failed.")
      setCancelling(false);
    }
  }, [isErrorVault])


  useEffect(() => {
    if (processed == true && executed == true && isWithdraw == false) {
      setRequestStatus(2);
    } else {
      if (processed == false) {
        setRequestStatus(0);
      }
      if (processed == true) {
        setRequestStatus(1);
      }
    }

  }, [processed, executed, isWithdraw])

  return (
    <div className="flex gap-2 items-center group  rounded-[12px] mt-[12px] md:mt-[17px]">
      <div className="bg-primary flex items-center w-[calc(100%-9px)] md:w-full justify-between py-[15px] px-[13px]  md:px-[16px] rounded-[10px]">
        <div className="flex items-center gap-[16px] md:gap-[32px]">
          <div className={clsx('w-fit md:w-[86px] h-[30px] flex items-center justify-center border border-solid rounded-[100px] px-[9.5px] md:px-[5px]', !isWithdraw ? 'border-[#61CD81] bg-[#61CD8129] text-[#239942]' : 'border-[#E151414D] bg-[#F3DDDC] text-[#E15141]')}>
            <p className="text-[12px] leading-[22px] font-medium">{!isWithdraw ? 'Deposit' : 'Withdraw'}</p>
          </div>
          <div >
            <p className="text-[12px] font-bold">Request id {id}</p>
            <p className="text-[12px] text-text-secondary leading-[18px] font-normal">{format(new Date(timestamp * 1000), 'MMMM d, yyyy')}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className={clsx('rounded-[100px] mt-[-27px] mr-[-22px] md:mr-[-12px] ', requestStatus === 0 ? 'bg-[#F9E3CD] text-[#E07103]' : (requestStatus === 1 ? 'bg-secondary text-[#239942]' : 'bg-[#E15141] text-white'))}>
            <p className="flex gap-1 text-[10px] leading-[14px] font-medium items-center px-[12px] py-[6px]">
              {requestStatus === 0 ? (<Image src="/icons/clock.svg" alt="Plus Icon" width={12} height={12} />) : (requestStatus === 1 ? <IoMdCheckmark size={12} /> : <IoMdClose size={12} />)}
              {requestStatus === 0 ? 'Pending' : (requestStatus === 1 ? 'Completed' : 'Cancelled')}</p>
          </div>
          <p className="mt-2 text-right text-[16px] text-text-primary font-bold">${numeral(Number(amount).toLocaleString()).format("0.[000]")}</p>

        </div>
      </div>
      {
        !isWithdraw && !processed &&
        <button className="hidden flex-col items-center space-y-2 hover:opacity-80 transition disabled:opacity-50  group-hover:flex"
          disabled={cancelling}
          onClick={cancelDeposit}>
          <Image
            src="/icons/cancel.png"
            alt="Icon"
            width={20} height={20}
            className="rounded-full object-cover"
          />
          <span className="text-[12px] font-normal text-text-secondary">{cancelling ? 'Canceling' : 'Cancel'}</span>
        </button>
      }
      {
        isWithdraw && processed && !executed && <button className="flex flex-col items-center space-y-2 hover:opacity-80 transition disabled:opacity-50 bg-green-300 text-white py-1 px-2 rounded-full"
          disabled={receiving}
          onClick={executeWithdraw}>{receiving ? 'Receiving' : 'Receive'}</button>
      }
    </div>
  );
}
