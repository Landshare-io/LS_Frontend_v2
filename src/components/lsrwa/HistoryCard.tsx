'use client';

import { useState } from 'react';
import clsx from "clsx";
import { format } from 'date-fns';
import Image from 'next/image';
import { ethers } from "ethers";

import { connectWallet } from "@/utils/wallet";
import vaultAbi from "@/abis/Vault.json";
import { formatNumber } from "@/utils/helpers/format-numbers";


export default function HistoryCard({ isWithdraw, id, timestamp, amount, processed, fetchRequests, executed }: any) {
  const [cancelling, setCancelling] = useState(false);
  const [receiving, setReceiving] = useState(false);


  const cancelDeposit = async () => {
    if (cancelling) return;
    const walletConnection = await connectWallet();
    if (walletConnection) {
      const { signer } = walletConnection;
      try {
        if (!signer) return alert("Connect wallet first");
        setCancelling(true);

        const vault = new ethers.Contract((process.env.NEXT_PUBLIC_VAULT_ADDRESS as any), vaultAbi, signer);
        const tx = await vault.cancelDepositRequest(BigInt(id));
        await tx.wait();

        setCancelling(false);
        fetchRequests();
      } catch (err: any) {
        setCancelling(false);
        alert('Failed deposit cancel:' + (err?.reason || err?.message));
      }
    }
  }

  const executeWithdraw = async () => {
    if (receiving) return;
    try {
      const walletConnection = await connectWallet();
      if (walletConnection) {
        const { signer } = walletConnection;
        if (!signer) return alert("Connect wallet first");
        setReceiving(true);

        const vault = new ethers.Contract((process.env.NEXT_PUBLIC_VAULT_ADDRESS as any), vaultAbi, signer);
        const tx = await vault.executeWithdraw(BigInt(id));
        await tx.wait();
        setReceiving(false);
        alert("Withdraw executed!");
        fetchRequests();
      }
    } catch (err: any) {
      console.error(err);
      setReceiving(false);
      alert("Error: " + (err?.reason || err?.message));
    }
  };

  return (
    <div className="flex gap-2 items-center group bg-secondary rounded-[12px] mt-[10px]">
      <div className="mt-1 flex items-center w-full justify-between py-[8px] px-[12px]">
        <div className="flex items-center gap-3 md:gap-10">
          <div className={clsx('w-[80px] md:w-[116px] border border-solid rounded-[100px] px-[5px] md:px-[21px] py-[5px]', !isWithdraw ? 'border-[#61CD81] bg-third text-[#239942]' : 'border-[#E151414D] bg-[#E1514129] text-[#E15141]')}>
            <p className="text-base leading-[22px] font-medium">{!isWithdraw ? 'Deposit' : 'Withdraw'}</p>
          </div>
          <div >
            <p className="text-text-secondary font-semibold">Request id {id}</p>
            <p className="text-base leading-[30px] text-gray">{format(new Date(timestamp * 1000), 'MMMM d, yyyy')}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className={clsx('rounded-[100px] px-[12px] py-[2px]', !processed ? 'bg-[#E0710333] text-[#E07103]' : 'bg-third text-[#239942]')}>
            <p className="flex gap-1 text-base leading-[14px] font-medium">
              {!processed && <Image src="/icons/clock.svg" alt="Plus Icon" width={12} height={12} />}
              {!processed ? 'Pending' : 'Completed'}</p>
          </div>
          <p className="mt-2 text-right text-[18px] text-text-secondary font-semibold">${formatNumber(amount)}</p>

        </div>
      </div>
      {
        !isWithdraw && !processed &&
        <button className="mt-6 hidden flex-col items-center space-y-2 hover:opacity-80 transition disabled:opacity-50  group-hover:flex"
          disabled={cancelling}
          onClick={cancelDeposit}>
          <Image
            src="/icons/cancel.png"
            alt="Icon"
            width={20} height={20}
            className="rounded-full object-cover"
          />
          <span className="text-[12px] text-gray">{cancelling ? 'Canceling' : 'Cancel'}</span>
        </button>
      }
      {
        isWithdraw && processed && !executed && <button className="mt-6 flex flex-col items-center space-y-2 hover:opacity-80 transition disabled:opacity-50 bg-green-300 text-white py-1 px-2 rounded-full"
          disabled={receiving}
          onClick={executeWithdraw}>{receiving ? 'Receiving' : 'Receive'}</button>
      }
    </div>
  );
}
