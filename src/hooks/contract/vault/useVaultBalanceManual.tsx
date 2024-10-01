import { useState, useEffect } from "react"
import { useWaitForTransactionReceipt } from "wagmi";
import { formatEther, BigNumberish } from "ethers";
import { bsc } from "viem/chains";
import { Address } from "viem";
import { useGlobalContext } from "../../../context/GlobalContext";
import useDeposit from "../AutoVaultV2Contract/useDeposit";
import useWithdraw from "../AutoVaultV2Contract/useWithdraw";
import useBalanceOfLpTokenV2 from "../LpTokenV2Contract/useBalanceOf";
import useAllowanceOfLpTokenV2 from "../LpTokenV2Contract/useAllowance";
import useApprove from "../LpTokenV2Contract/useApprove";
import useTotalStaked from "../MasterchefContract/useTotalStaked";
import useUserInfo from "../MasterchefContract/useUserInfo";
import usePendingLand from "../MasterchefContract/usePendingLand";
import { AUTO_VAULT_V3_CONTRACT_ADDRESS, MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useVaultBalanceManual(address: Address | undefined, updateStatus: Function) {
  const { setScreenLoadingStatus } = useGlobalContext()
  const { deposit, data: depositTx } = useDeposit()
  const { withdraw, data: withdrawTx } = useWithdraw()
  const { approve, data: approveTx } = useApprove()
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
  const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({
    hash: approveTx,
    chainId: bsc.id
  });

  useEffect(() => {
    try {
      if (depositSuccess) {
        refetchLpTokenV2()
        refetchAllowanceOfLpTokenV2OfVault()
        refetchAllowanceOfLpTokenV2OfMasterChef()
        setScreenLoadingStatus("Deposit Transaction success")
      } else {
        setScreenLoadingStatus("Transaction failed")
      }
    } catch (error) {
      setScreenLoadingStatus("Transaction failed")
      console.log(error)
    }

    return () => {
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000);
    }
  }, [depositSuccess])

  useEffect(() => {
    try {
      if (withdrawSuccess) {
        refetchLpTokenV2()
        refetchTotalStaked()
        refetchUserInfo()
        refetchPendingLand()
        setScreenLoadingStatus("Withdraw Transaction success")
      } else {
        setScreenLoadingStatus("Transaction failed")
      }
    } catch (error) {
      setScreenLoadingStatus("Transaction failed")
      console.log(error)
    }

    return () => {
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000);
    }
  }, [withdrawSuccess])

  useEffect(() => {
    try {
      if (approveSuccess) {
        refetchAllowanceOfLpTokenV2OfVault()
        refetchAllowanceOfLpTokenV2OfMasterChef()

        setScreenLoadingStatus("Approve Transaction success")
      } else {
        setScreenLoadingStatus("Transaction failed")
      }
    } catch (error) {
      setScreenLoadingStatus("Transaction failed")
      console.log(error)
    }

    return () => {
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000);
    }
  }, [approveSuccess])

  const depositVault = (amount: BigNumberish) => {
    if (Number(formatEther(amount)) > Number(formatEther(lpTokenV2Balance))) {
      window.alert("Insufficient Balance");
      return;
    }

    setScreenLoadingStatus("Deposit Transaction in progress...")
    deposit(amount)
  }

  const withdrawVault = (amount: BigNumberish) => {
    setScreenLoadingStatus("Withdraw Transaction in progress...")
    withdraw(amount)
  }

  const approveVault = () => {
    setScreenLoadingStatus("Approve Transaction in progress...")
    approve(MASTERCHEF_CONTRACT_ADDRESS, "1000000000000000000000000000000")
    updateStatus()
  }

  return {
    depositVault,
    withdrawVault,
    approveVault
  }
}
