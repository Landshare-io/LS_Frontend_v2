'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import vaultAbi from '@/abis/Vault.json';
import { useAccount, useChainId, useWalletClient } from 'wagmi';
import type { Address } from "viem";
import { LSRWA_VAULT_ADDRESS } from "@/config/constants/environments";
import { Web3Provider } from '@ethersproject/providers';
import ProgressBar from '../common/progressbar';

const AVERAGE_BLOCK_TIME_MS = 15 * 1000;


export default function EpochInfoCard({ refresh = false }) {
  const { data: walletClient } = useWalletClient();

  const [progress, setProgress] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const [startTimeMs, setStartTimeMs] = useState(0);
  const [endTimestampMs, setEndTimestampMs] = useState(0);
  const chainId = useChainId()
  const vaultAddress: Address = LSRWA_VAULT_ADDRESS[chainId];

  const { isConnected } = useAccount();
  const displayTime = (durationMs: number) => {
    const now = Date.now();

    const timeLeft = Math.max(0, endTimestampMs - now);

    const progressPercent = Math.min(100, ((durationMs - timeLeft) / durationMs) * 100);

    setTimeLeftMs(timeLeft);
    setProgress(progressPercent);
  }

  useEffect(() => {
    let interval: any;

    async function getEpochBlocks() {

      if (walletClient) {

        const provider = new Web3Provider(walletClient as any);

        const vault = new ethers.Contract(vaultAddress, vaultAbi, provider as unknown as ethers.Signer);

        const epochDuration = Number(await vault.epochDuration());
        const startBlock = await vault.epochStart();

        const durationMs = epochDuration * AVERAGE_BLOCK_TIME_MS;

        // Request account access if needed
        await provider.send("eth_requestAccounts", []);

        // Fetch the current block number
        const blockNumber = await provider.getBlockNumber();

        // Get block details using the block number
        const block = await provider.getBlock(startBlock == 0 ? blockNumber : startBlock);

        const startTimestampMs = Number(block.timestamp) * 1000;
        setStartTimeMs(startTimestampMs);

        const endTimestampMs = startTimestampMs + durationMs;
        setEndTimestampMs(endTimestampMs)
        displayTime(durationMs)


        interval = setInterval(() => {
          displayTime(durationMs);
        }, 60000);
      }
    }
    if (isConnected) {
      getEpochBlocks();
      return () => clearInterval(interval);
    }

  }, [refresh, walletClient]);

  const formattedTimeLeft = formatDuration(
    intervalToDuration({ start: 0, end: timeLeftMs }),
    { format: ['days', 'hours', 'minutes', 'seconds'] }
  );

  const formattedStartDate = startTimeMs
    ? format(startTimeMs, 'MMM d, yyyy')
    : 'Loading...';
  const formattedStartTime = startTimeMs
    ? format(startTimeMs, 'HH:mm')
    : 'Loading...';
  const formattedEnd = endTimestampMs
    ? format(endTimestampMs, 'MMM d, yyyy HH:mm')
    : 'Loading...';

  return (
    <div className="bg-secondary rounded-[20px] flex flex-col justify-between w-full py-[25px] px-[20px] md:py-[30px] md:pl-[35px] md:pr-[23px]">
      <p className='text-[20px] md:text-[24px] font-bold leading-[30px] text-text-primary'>Epoch Information</p>
      <div className='mt-[10px] flex flex-col md:flex-row md:justify-between'>
        <div>
          <p className='text-text-secondary font-medium leading-[20px] md:w-[545px] text-[14px]'>At LSRWA Express, we operate in weekly epochs that process deposits, withdrawals, and borrowing in an orderly cycle. This ensures fairness and liquidity availability for everyone.</p>
        </div>
        <div className='flex gap-5 w-full justify-evenly md:justify-start mt-[40px] md:mt-[-35px] md:w-fit'>
          <div className='text-center'>
            <p className='font-bold text-center text-[16px] text-text-primary'>{formattedStartDate}</p>
            <p className='font-medium  text-[16px] text-text-secondary text-center'>Start Date</p>
          </div>
          <div className='text-center'>
            <p className='font-bold text-center text-[16px] text-text-primary'>{formattedStartTime} UTC</p>
            <p className='font-medium  text-[16px] text-text-secondary text-center'>Start Time</p>
          </div>
        </div>
      </div>

      <div className='flex flex-col-reverse md:flex-row justify-between gap-[16px] md:gap-[20px]  w-full mt-[51px] md:mt-[8.5px] items-center whitespace-nowrap'>
        <ProgressBar now={progress} min={0} max={100} containerClass={`!border-none !bg-[#DEF1E6] h-[24px] !rounded-[90px]`} color={`!bg-green-500 !rounded-[90px]`} />
        <div className='flex flex-col items-start text-start w-full md:w-fit md:text-center'>
          <p className='font-medium text-text-secondary text-center text-[12px]'>Expected Next Epoch In</p>
          <p className='font-bold text-center text-text-primary text-[16px]'>{formattedTimeLeft}</p>
        </div>
      </div>
    </div>

  );
}
