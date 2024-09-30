import { useState, useEffect } from "react"
import { useWaitForTransactionReceipt } from "wagmi";
import { formatEther } from "ethers";
import { bsc } from "viem/chains";
import useDeposit from "../AutoVaultV2Contract/useDeposit";
import useBalanceOf from "../LpTokenV2Contract/useBalanceOf";
import { BigNumberish } from "ethers";
import { Address } from "viem";

export default function useVaultBalanceManual(address: Address) {
  const [transactionState, setTransactionState] = useState("")
  const { deposit, data: depositTx } = useDeposit()
  const lpTokenV2Balance = useBalanceOf({ address }) as BigNumberish

  const { isSuccess: depositSuccess, isLoading: rwaApproveLoading } = useWaitForTransactionReceipt({
    hash: depositTx,
    chainId: bsc.id
  });

  useEffect(() => {
    try {
      setTransactionState("Deposit Transaction success")
    } catch (error) {
      setTransactionState("Transaction failed")
      console.log(error)
    }
  }, [depositSuccess])

  const depositVault = (amount: BigNumberish) => {
    if (Number(formatEther(amount)) > Number(formatEther(lpTokenV2Balance))) {
      window.alert("Insufficient Balance");
      return;
    }

    deposit(amount)
  }

  return {
    depositVault
  }
}
