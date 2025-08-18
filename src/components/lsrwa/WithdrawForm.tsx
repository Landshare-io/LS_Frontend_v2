"use client";

import { useState } from "react";
import { ethers } from "ethers";
import vaultAbi from "@/abis/Vault.json";
import { connectWallet } from "@/utils/wallet";
import { useAccount, useChainId } from "wagmi";
import { LSRWA_VAULT_ADDRESS } from "@/config/constants/environments";

export default function WithdrawForm() {
  const {
    isConnected,
  } = useAccount();
  const chainId = useChainId();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const handleWithdraw = async () => {
    try {
      const walletConnection = await connectWallet();
      if (walletConnection !== null) {
        const { signer } = walletConnection;
        if (!isConnected) return alert("Wallet not connected");

        const vault = new ethers.Contract(LSRWA_VAULT_ADDRESS[chainId], vaultAbi, signer);

        const parsedAmount = ethers.parseUnits(amount, 6); // USDC uses 6 decimals

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
