'use client'

import { useEffect, useState } from 'react'
import { connectWallet } from "@/utils/wallet";
import { useDepositorAccount } from '@/hooks/lsrwa/useDepositorAccount'
import { usePerformance } from '@/hooks/lsrwa/usePerformance'
import Progressbar from "./Progressbar"
import { useAccount } from 'wagmi';


export default function AccountCard() {
  const { rewardAPR, isLoading } = useDepositorAccount()
  const { fetchTotalValue, collateralValue } = usePerformance()

  const { isConnected } = useAccount()

  const [totalValue, setTotalValue] = useState('0')
  const [collateral, setCollateral] = useState('0')

  useEffect(() => {
    const fetchValues = async () => {
      if (isConnected) {
        const walletConnection = await connectWallet();
        if (walletConnection !== null) {
          const { signer } = walletConnection;
          const total = await fetchTotalValue(signer);
          const col = await collateralValue();
          setTotalValue(total)
          setCollateral(col)
        } else {
          console.error('Failed to connect wallet: Connection is null');
        }
      }
    }

    fetchValues()
  }, [])

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
        <Progressbar progress={67} height={9} />
        <p className='mt-[5px] text-center font-medium leading-[20px]'>Vault Capacity: ${collateral}</p>
      </div>
    </div>
  )
}
