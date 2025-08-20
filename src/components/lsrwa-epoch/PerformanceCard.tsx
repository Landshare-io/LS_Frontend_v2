'use client'

import { useEffect, useState } from 'react'
import { useDepositorAccount } from '@/hooks/lsrwa-epoch/useDepositorAccount'
import { useAccount, useChainId } from 'wagmi';
import usefetchTotalValue from '@/hooks/contract/LSRWAEpoch/usefetchTotalValue';
import { Address } from 'viem';
import numeral from 'numeral';
import { formatUnits, formatEther, BigNumberish } from 'ethers';
import useBalanceOf from "@/hooks/contract/RWAContract/useBalanceOf";
import { LSRWA_VAULT_ADDRESS } from "@/config/constants/environments";
import useGetRwaPrice from "@/hooks/contract/APIConsumerContract/useGetRwaPrice";
import ProgressBar from '../common/progressbar';


export default function AccountCard() {
  const { rewardAPR, isLoading } = useDepositorAccount()
  const { address } = useAccount()
  const chainId = useChainId();
  const { data: totalDepositValue, refetch } = usefetchTotalValue(chainId, [(address as Address)]);

  const [totalValue, setTotalValue] = useState('0')
  const [collateral, setCollateral] = useState('0')
  const [ratio, setRatio] = useState(0)
  const { data: balanceOfRWA, isLoading: isLoadingOfRWA, refetch: refetchBalanceOfRWA } = useBalanceOf(chainId, LSRWA_VAULT_ADDRESS[chainId])
  const rwaPrice = useGetRwaPrice(chainId) as BigNumberish;

  useEffect(() => {
    if (totalDepositValue != null) {
      setTotalValue(numeral(Number(formatUnits(totalDepositValue as any, 6))).format("0.[000]"))
    }
    const _pooltoken = formatUnits((balanceOfRWA as any), 18);
    if (Number(_pooltoken) != 0) {
      const _ratio = Number(totalValue) * 100 / Number(_pooltoken);
      setRatio(_ratio);
    }
  }, [totalDepositValue])

  useEffect(() => {
    if (balanceOfRWA != null && rwaPrice != null) {
      const _pooltoken = formatUnits((balanceOfRWA as any), 18);
      const tokenPrice = parseFloat(Number(formatEther(rwaPrice ?? 0)).toString() || '1');
      setCollateral(numeral(Number(_pooltoken) * Number(tokenPrice)).format("0.[000]"))

      if (Number(_pooltoken) != 0) {
        const _ratio = Number(totalValue) * 100 / Number(_pooltoken);
        setRatio(_ratio);
      }

    }
  }, [balanceOfRWA, rwaPrice])

  return (
    <div className="flex flex-col justify-between w-full h-[175px] border-green bg-secondary rounded-[11px] shadow-[1px_3px_4px_0px_rgba(0,0,0,0.15)] p-[14px]">
      <p className='text-base font-medium leading-[22px]'>Performance Metrics</p>
      <div className='flex gap-1 h-[69px]'>
        <div className='flex flex-col items-start justify-center w-full h-full rounded-[6px]'>
          <p className='text-text-secondary font-semibold'>Total Value Locked</p>

          <p className='text-center font-bold text-[24px] leading-[30px]'>${totalValue}</p>

        </div>
        <div className='flex flex-col items-center justify-center w-full h-full rounded-[6px]'>
          <p className='text-text-secondary font-semibold'>Current APR</p>
          <p className='text-center font-bold text-[24px] leading-[30px]'>{isLoading ? '0' : rewardAPR}%</p>
        </div>
      </div>
      <div className='w-full'>
        <ProgressBar now={ratio} min={0} max={100} color={`!bg-green-500`} />
        <p className='mt-[5px] text-center font-medium leading-[20px]'>Vault Capacity: ${collateral}</p>
      </div>
    </div>
  )
}
