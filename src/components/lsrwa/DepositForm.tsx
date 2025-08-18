"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/hooks/lsrwa/useWallet";
import vaultAbi from "@/abis/Vault.json";
import erc20Abi from "@/abis/ERC20.json";
import { connectWallet } from "@/utils/wallet";
import { useChainId } from "wagmi";
import { USDC_ADDRESS } from "@/config/constants/environments";
import { LSRWA_VAULT_ADDRESS } from "@/config/constants/environments";

export default function DepositForm() {
  const {
    isConnected,
    balance,
  } = useWallet();
  const [amount, setAmount] = useState<number>(0);
  const [status, setStatus] = useState("");
  const chainId = useChainId()

  const handleDeposit = async () => {
    const walletConnection = await connectWallet();
    if (walletConnection) {
      const { signer } = walletConnection;
      if (amount > balance || amount === 0 || !amount) return
      try {
        if (!isConnected) return alert("Wallet not connected");
        const usdc = new ethers.Contract(USDC_ADDRESS[chainId], erc20Abi, signer);
        const vault = new ethers.Contract(LSRWA_VAULT_ADDRESS[chainId], vaultAbi, signer);

        const parsedAmount = ethers.parseUnits(amount.toString(), 6); // USDC uses 6 decimals

        setStatus("Checking allowance...");
        const owner = await signer.getAddress();
        const allowance = await usdc.allowance(owner, LSRWA_VAULT_ADDRESS[chainId]);

        if (allowance < parsedAmount) {
          console.log('approve started')
          setStatus("Approving USDC...");
          const approveTx = await usdc.approve(LSRWA_VAULT_ADDRESS[chainId], parsedAmount);
          await approveTx.wait();
        }
        setStatus("Requesting deposit...");
        const depositTx = await vault.requestDeposit(parsedAmount);
        await depositTx.wait();
        console.log('depositTx => ', depositTx)

        setStatus("Requested deposit!");
        setTimeout(() => {
          window.location.reload();
        }, 1000)

      } catch (error: any) {
        console.error(error);
        setStatus("Error: " + (error?.reason || error?.message));
      }
    }
  };

  const handleOnChange = (e: any) => {
    setAmount(e.target.value)
  }

  const setAmountByPercent = (percent: number) => {
    setAmount(balance * percent)
  }

  return (
    <div className="sm:flex sm:items-start">
      <div className="text-center sm:text-left">
        <div className="text-base font-bold text-text-primary text-[20px]">
          Deposit USDC to invest in income-generating real estate
        </div>
        <div className="mt-[18px]">
          <p className="text-sm text-text-secondary text-[12px] font-semibold">
            Set Amount
          </p>
        </div>
        <div className="mt-[7px]">
          <div className='flex flex-col md:flex-row items-center'>
            <input type="number" className='bg-transparent focus:outline-none w-full md:w-[200px] px-[18px] py-[23px] text-[18px]' value={amount} onChange={handleOnChange} />
            <button className='border-[1px] border-[#61CD81] w-full md:w-fit px-[23px] py-[7px] rounded-full bg-secondary text-[#61CD81]' onClick={() => setAmountByPercent(0.25)}>25%</button>
            <button className='mt-[9px] md:mt-0 md:ml-[9px] border-[1px] border-[#61CD81] w-full md:w-fit px-[23px] py-[7px] rounded-full bg-secondary text-[#61CD81]' onClick={() => setAmountByPercent(0.5)}>50%</button>
            <button className='mt-[9px] md:mt-0 md:ml-[9px] border-[1px] border-[#61CD81] w-full md:w-fit px-[23px] py-[7px] rounded-full bg-secondary text-[#61CD81]' onClick={() => setAmountByPercent(1)}>100%</button>
          </div>
        </div>
        <div className="mt-2">

          {status.length === 0 && (<button className={`w-full rounded-full py-[14px] text-white ${amount === 0 || !amount ? 'bg-[#9D9D9D]' : (amount > balance ? 'bg-[#E15141]' : 'bg-[#61CD81]')}`} onClick={handleDeposit}>{amount === 0 || !amount ? 'Enter Amount' : (amount > balance ? 'Insufficient Balance' : 'Deposit')}</button>)}
          {status.length > 0 && (<button className={`w-full rounded-full py-[14px] text-white bg-[#415ee1]`} >{status}</button>)}
        </div>

      </div>
    </div>
  );
}
