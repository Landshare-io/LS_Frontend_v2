'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import vaultAbi from '@/abis/Vault.json';

const AVERAGE_BLOCK_TIME_MS = (process.env.NEXT_PUBLIC_BLOCK_TIME as any) * 1000;
const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
const vaultAddress: any = process.env.NEXT_PUBLIC_VAULT_ADDRESS;

export default function EpochProgressBar({ refresh = false }) {
  const [progress, setProgress] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const [startTimeMs, setStartTimeMs] = useState(0);
  const [endTimestampMs, setEndTimestampMs] = useState(0);

  useEffect(() => {
    let interval: any;

    async function getEpochBlocks() {
      const vault = new ethers.Contract(vaultAddress, vaultAbi, provider);
      const epochDuration = Number(await vault.epochDuration());
      const startBlock = await vault.epochStart();

      const durationMs = epochDuration * AVERAGE_BLOCK_TIME_MS;

      const block: any = await provider.getBlock(startBlock);
      const startTimestampMs = Number(block.timestamp) * 1000;
      setStartTimeMs(startTimestampMs);

      const endTimestampMs = startTimestampMs + durationMs;
      setEndTimestampMs(endTimestampMs)
      displayTime()
      function displayTime() {
        const now = Date.now();

        const timeLeft = Math.max(0, endTimestampMs - now);

        const progressPercent = Math.min(100, ((durationMs - timeLeft) / durationMs) * 100);

        setTimeLeftMs(timeLeft);
        setProgress(progressPercent);
      }

      interval = setInterval(() => {
        displayTime();
      }, 60000);
    }

    getEpochBlocks();

    return () => clearInterval(interval);
  }, [refresh]);

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
    <div>
      <p className='text-[24px] font-bold leading-[30px]'>Epoch Information</p>
      <div className='mt-[10px] flex flex-col md:flex-row md:justify-between'>
        <div>
          <p className='text-text-secondary font-medium leading-[20px] md:w-[600px]'>At LSRWA Express, we operate in weekly epochs that process deposits, withdrawals, and borrowing in an orderly cycle. This ensures fairness and liquidity availability for everyone,</p>
        </div>
        <div className='flex gap-5 w-full justify-evenly md:justify-start mt-[10px] md:mt-0 md:w-fit'>
          <div className='text-center'>
            <p className='font-bold text-center'>{formattedStartDate}</p>
            <p className='font-medium text-text-secondary text-center'>Start Date</p>
          </div>
          <div className='text-center'>
            <p className='font-bold text-center'>{formattedStartTime} UTC</p>
            <p className='font-medium text-text-secondary text-center'>Start Time</p>
          </div>
        </div>
      </div>
      <div className='lg:flex justify-between gap-2 w-full mt-4 items-center whitespace-nowrap'>

        <div className="w-full h-3 bg-[#DEF1E6] rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className='text-center'>
          <p className='font-bold text-center'>{formattedTimeLeft}</p>
          <p className='font-medium text-text-secondary text-center'>Expected Next Epoch In</p>
        </div>
      </div>
    </div>

  );
}
