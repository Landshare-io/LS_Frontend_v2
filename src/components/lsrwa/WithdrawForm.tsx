"use client";

import { useState } from "react";
import { ethers } from "ethers";
import vaultAbi from "@/abis/Vault.json";
import { connectWallet } from "@/utils/wallet";
import { useAccount } from "wagmi";

export default function WithdrawForm() {
  const {
    isConnected,
  } = useAccount();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const handleWithdraw = async () => {
    try {
      const walletConnection = await connectWallet();
      if (walletConnection !== null) {
        const { signer } = walletConnection;
        if (!isConnected) return alert("Wallet not connected");

        const vault = new ethers.Contract((process.env.NEXT_PUBLIC_VAULT_ADDRESS as any), vaultAbi, signer);

        const parsedAmount = ethers.parseUnits(amount, parseInt((process.env.NEXT_PUBLIC_USDC_DECIMALS as any))); // USDC uses 6 decimals

        setStatus("Requesting withdraw...");
        const withdrawTx = await vault.requestWithdraw(parsedAmount);
        await withdrawTx.wait();

        setStatus("Requested withdraw!");
      }
    } catch (error : any) {
      console.error(error);
      setStatus("Error: " + (error?.reason || error?.message));
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-6 p-6">
      <input
        type="number"
        placeholder="Amount in USDC"
        className="border rounded px-3 py-2"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={handleWithdraw}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Withdraw USDC
      </button>
      <p className="text-sm">{status}</p>
    </div>
  );
}
