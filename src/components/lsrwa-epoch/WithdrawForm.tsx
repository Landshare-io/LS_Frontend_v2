"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useChainId, useWaitForTransactionReceipt } from "wagmi";
import useRequestWithdraw from "@/hooks/contract/LSRWAEpoch/useRequestWithdraw";
import { TRANSACTION_CONFIRMATIONS_COUNT } from "@/config/constants/environments";

export default function WithdrawForm() {

  const chainId = useChainId();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const {
    requestWithdraw: requestWithdrawVault,
    isPending: isPendingRequestWithdraw,
    isError: isErrorRequestWithdraw,
    error: errorRequestWithdraw,
    data: dataRequestWithdrawTx
  } = useRequestWithdraw(chainId);

  const { isSuccess: requestWithdrawSuccess, data: requestWithdrawStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: dataRequestWithdrawTx,
    chainId: chainId
  });

  useEffect(() => {
    if (requestWithdrawSuccess) {
      setStatus("Requested withdraw!");
    }
  }, [requestWithdrawSuccess])

  const handleWithdraw = async () => {
    setStatus("Requesting withdraw...");
    const parsedAmount = ethers.parseUnits(amount, 6); // USDC uses 6 decimals
    requestWithdrawVault(parsedAmount)
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
