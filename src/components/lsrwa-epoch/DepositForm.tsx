"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useBalance, useAccount, useChainId, useWaitForTransactionReceipt } from "wagmi";
import { TRANSACTION_CONFIRMATIONS_COUNT } from "@/config/constants/environments";
import { LSRWA_VAULT_ADDRESS } from "@/config/constants/environments";
import { BigNumberish } from 'ethers';
import useApproveOfUsdcContract from '@/hooks/contract/UsdcContract/useApprove';
import useAllowanceOfUsdcContract from '@/hooks/contract/UsdcContract/useAllowance';
import useRequestDeposit from "@/hooks/contract/LSRWAEpoch/useRequestDeposit";
import { USDC_ADDRESS } from "@/config/constants/environments";
import numeral from "numeral";
import { formatUnits } from 'ethers';

interface DepositFormProps {
  setOpen: any,
  fetchHistoryData: boolean,
  setFetchHistoryData: any
}

export default function DepositForm({ setOpen, fetchHistoryData, setFetchHistoryData }: DepositFormProps) {

  const [amount, setAmount] = useState<number>(0);
  const { address } = useAccount();
  const [balance, setBalance] = useState(0)
  const [status, setStatus] = useState("");
  const chainId = useChainId()

  const {
    data: usdcBalance,
  } = useBalance({
    address: address,
    token: USDC_ADDRESS[chainId],
    chainId: chainId,
  }) as { data: any, isPending: any, refetch: any };

  useEffect(() => {
    if (usdcBalance) {
      setBalance(Number(usdcBalance?.value ? numeral(formatUnits(usdcBalance.value, 6)).format("0.[000]") : '0.0'));
    }
  }, [usdcBalance])

  const { approve: approveUsdc, data: usdcApproveTx, isError: isUsdcApproveError } = useApproveOfUsdcContract()
  const { data: usdcAllowance, refetch: usdcAllowanceRefetch } = useAllowanceOfUsdcContract(chainId, address, LSRWA_VAULT_ADDRESS[chainId]) as {
    data: BigNumberish,
    refetch: Function
  }
  const { isSuccess: usdcApproveSuccess, data: usdcApproveStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: usdcApproveTx,
    chainId: chainId
  });

  const {
    requestDeposit,
    isPending: isPendingVault,
    isError: isErrorVault,
    error: errorValut,
    data: dataVaultTx
  } = useRequestDeposit(chainId);

  const { isSuccess: usdcDepositSuccess } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: dataVaultTx,
    chainId: chainId
  });

  const handleDeposit = async () => {
    if (amount > balance || amount === 0 || !amount) return
    try {
      const parsedAmount = ethers.parseUnits(amount.toString(), 6); // USDC uses 6 decimals
      setStatus("Checking allowance...");
      if (ethers.parseUnits(usdcAllowance.toString(), 6) < parsedAmount) {
        setStatus("Approving USDC...");
        await approveUsdc(chainId, LSRWA_VAULT_ADDRESS[chainId], parsedAmount);
      } else {
        setStatus("Requesting deposit...")
        const parsedAmount = ethers.parseUnits(amount.toString(), 6);
        await requestDeposit(parsedAmount)
      }

    } catch (error: any) {
      console.error(error);
      setStatus("Error: " + (error?.reason || error?.message));
    }
  };

  const handleRequestDeposit = async () => {
    if (isErrorVault) {
      console.log('errorValut => ', errorValut)
    } else {
      console.log('isPendingVault => ', isPendingVault)
      if (!isPendingVault) {
        setStatus("Requesting deposit...")
        const parsedAmount = ethers.parseUnits(amount.toString(), 6);
        await requestDeposit(parsedAmount)
      }
    }
  }

  useEffect(() => {
    if (usdcDepositSuccess) {
      setStatus("Requested deposit!");
      setOpen(false);
      setFetchHistoryData(!fetchHistoryData)
    }
  }, [usdcDepositSuccess])

  useEffect(() => {
    try {
      if (isUsdcApproveError) {
        console.log('Approve Error : => ', isUsdcApproveError)
      } else if (usdcApproveTx) {
        if (usdcApproveStatusData) {
          if (usdcApproveSuccess) {
            handleRequestDeposit()
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }, [usdcApproveTx, usdcApproveStatusData, usdcApproveSuccess, isUsdcApproveError])

  const handleOnChange = (e: any) => {
    setAmount(e.target.value)
  }

  const setAmountByPercent = (percent: number) => {
    setAmount(balance * percent)
  }

  return (
    <div className="sm:flex sm:items-start">
      <div className="text-center sm:text-left w-full">
        <div className="font-bold text-text-primary text-[20px] text-center">
          Deposit USDC to invest in <br />income-generating real estate
        </div>
        <div className="mt-[18px]">
          <p className="text-sm text-text-secondary text-[14px] md:text-[12px] font-semibold text-start">
            Set Amount
          </p>
        </div>
        <div className="mt-[7px]">
          <div className='flex flex-col md:flex-row items-center'>
            <input type="number" className={`focus:outline-none w-full h-[58px] md:w-[200px] px-[18px] py-[23px] text-[18px] font-semibold rounded-full ${amount > balance ? 'bg-[#F3DDDC]' : 'bg-primary'}`} value={amount} onChange={handleOnChange} />
            <div className="flex w-full md:w-fit justify-between mt-[18.06px] md:mt-0">
              <button className='flex items-center justify-center border-[1px] border-[#61CD81] md:mt-0 md:ml-[15px] w-[96px] h-[35px] md:w-[76.55px] md:h-[31.12px] rounded-full bg-[#E0F1E5] text-[#61CD81] font-bold text-[14px]' onClick={() => setAmountByPercent(0.25)}>25%</button>
              <button className='flex items-center justify-center md:mt-0 md:ml-[9px] border-[1px] border-[#61CD81] w-[96px] h-[35px] md:w-[76.55px] md:h-[31.12px] rounded-full bg-[#E0F1E5] text-[#61CD81] text-[14px] font-bold' onClick={() => setAmountByPercent(0.5)}>50%</button>
              <button className='flex items-center justify-center md:mt-0 md:ml-[9px] border-[1px] border-[#61CD81] w-[96px] h-[35px] md:w-[76.55px] md:h-[31.12px] py-[7px] rounded-full bg-[#E0F1E5] text-[#61CD81] text-[14px] font-bold' onClick={() => setAmountByPercent(1)}>100%</button>
            </div>
          </div>
        </div>
        <div className="mt-[30.94px] md:mt-[23px]">
          {status.length === 0 && (<button className={`w-full h-[60px] rounded-full py-[14px] text-white font-bold text-[14px] ${amount === 0 || !amount ? 'bg-[#9D9D9D]' : (amount > balance ? 'bg-[#E15141]' : 'bg-[#61CD81]')}`} onClick={handleDeposit}>{amount === 0 || !amount ? 'Enter Amount' : (amount > balance ? 'Insufficient Balance' : 'Deposit')}</button>)}
          {status.length > 0 && (<button className={`w-full h-[60px] rounded-full py-[14px] text-white bg-[#61CD81]`} >{status}</button>)}
        </div>
      </div>
    </div>
  );
}
