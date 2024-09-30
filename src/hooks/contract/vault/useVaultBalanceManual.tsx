import { useState, useEffect } from "react"
import { useWaitForTransactionReceipt } from "wagmi";
import { formatEther, BigNumberish } from "ethers";
import { bsc } from "viem/chains";
import { Address } from "viem";
import useDeposit from "../AutoVaultV2Contract/useDeposit";
import useWithdraw from "../AutoVaultV2Contract/useWithdraw";
import useBalanceOfLpTokenV2 from "../LpTokenV2Contract/useBalanceOf";
import useAllowanceOfLpTokenV2 from "../LpTokenV2Contract/useAllowance";
import useTotalStaked from "../MasterchefContract/useTotalStaked";
import useUserInfo from "../MasterchefContract/useUserInfo";
import usePendingLand from "../MasterchefContract/usePendingLand";
import { AUTO_VAULT_V3_CONTRACT_ADDRESS, MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useVaultBalanceManual(address: Address | undefined) {
  const [transactionState, setTransactionState] = useState("")
  const { deposit, data: depositTx } = useDeposit()
  const { withdraw, data: withdrawTx } = useWithdraw()
  const { data: lpTokenV2Balance, refetch: refetchLpTokenV2 } = useBalanceOfLpTokenV2({ address }) as {
    data: BigNumberish,
    refetch: Function
  }
  const { refetch: refetchAllowanceOfLpTokenV2OfVault } = useAllowanceOfLpTokenV2(address, AUTO_VAULT_V3_CONTRACT_ADDRESS)
  const { refetch: refetchAllowanceOfLpTokenV2OfMasterChef } = useAllowanceOfLpTokenV2(address, MASTERCHEF_CONTRACT_ADDRESS)
  const { refetch: refetchTotalStaked } = useTotalStaked()
  const { refetch: refetchUserInfo } = useUserInfo({ address })
  const { refetch: refetchPendingLand } = usePendingLand({ address })

  const { isSuccess: depositSuccess } = useWaitForTransactionReceipt({
    hash: depositTx,
    chainId: bsc.id
  });
  const { isSuccess: withdrawSuccess } = useWaitForTransactionReceipt({
    hash: withdrawTx,
    chainId: bsc.id
  });

  useEffect(() => {
    try {
      if (depositSuccess) {
        refetchLpTokenV2()
        refetchAllowanceOfLpTokenV2OfVault()
        refetchAllowanceOfLpTokenV2OfMasterChef()
        setTransactionState("Deposit Transaction success")
      } else {
        setTransactionState("Transaction failed")
      }
    } catch (error) {
      setTransactionState("Transaction failed")
      console.log(error)
    }
  }, [depositSuccess])

  useEffect(() => {
    try {
      if (withdrawSuccess) {
        refetchLpTokenV2()
        refetchTotalStaked()
        refetchUserInfo()
        refetchPendingLand()
        setTransactionState("Withdraw Transaction success")
      } else {
        setTransactionState("Transaction failed")
      }
    } catch (error) {
      setTransactionState("Transaction failed")
      console.log(error)
    }
  }, [withdrawSuccess])

  const depositVault = (amount: BigNumberish) => {
    if (Number(formatEther(amount)) > Number(formatEther(lpTokenV2Balance))) {
      window.alert("Insufficient Balance");
      return;
    }

    deposit(amount)
  }

  const withdrawVault = (amount: BigNumberish) => {
    withdraw(amount)
  }

  return {
    depositVault,
    withdrawVault,
    transactionState
  }
}
