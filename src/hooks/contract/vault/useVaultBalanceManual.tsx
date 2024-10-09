import { useEffect } from "react"
import { useWaitForTransactionReceipt } from "wagmi";
import { formatEther, BigNumberish } from "ethers";
import { Address } from "viem";
import { bsc } from "viem/chains";
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

export default function useVaultBalanceManual(chainId: number, address: Address | undefined, updateStatus: Function) {
  const { setScreenLoadingStatus } = useGlobalContext()
  const { deposit, data: depositTx } = useDeposit(chainId)
  const { withdraw, data: withdrawTx } = useWithdraw(chainId)
  const { approve, data: approveTx } = useApprove(chainId)
  const { data: lpTokenV2Balance, refetch: refetchLpTokenV2 } = useBalanceOfLpTokenV2({ chainId, address }) as {
    data: BigNumberish,
    refetch: Function
  }
  const { refetch: refetchAllowanceOfLpTokenV2OfVault } = useAllowanceOfLpTokenV2(chainId, address, AUTO_VAULT_V3_CONTRACT_ADDRESS[bsc.id])
  const { refetch: refetchAllowanceOfLpTokenV2OfMasterChef } = useAllowanceOfLpTokenV2(chainId, address, MASTERCHEF_CONTRACT_ADDRESS[bsc.id])
  const { refetch: refetchTotalStaked } = useTotalStaked(chainId)
  const { refetch: refetchUserInfo } = useUserInfo({ chainId, userInfoId: 0, address })
  const { refetch: refetchPendingLand } = usePendingLand({ chainId, pendingLandId: 0, address })

  const { isSuccess: depositSuccess } = useWaitForTransactionReceipt({
    hash: depositTx,
    chainId: chainId
  });
  const { isSuccess: withdrawSuccess } = useWaitForTransactionReceipt({
    hash: withdrawTx,
    chainId: chainId
  });
  const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({
    hash: approveTx,
    chainId: chainId
  });

  useEffect(() => {
    try {
      if (depositTx) {
        if (depositSuccess) {
          refetchLpTokenV2()
          refetchAllowanceOfLpTokenV2OfVault()
          refetchAllowanceOfLpTokenV2OfMasterChef()
          setScreenLoadingStatus("Deposit Transaction success")
        } else {
          setScreenLoadingStatus("Transaction failed")
        }
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
  }, [depositTx, depositSuccess])

  useEffect(() => {
    try {
      if (withdrawTx) {
        if (withdrawSuccess) {
          refetchLpTokenV2()
          refetchTotalStaked()
          refetchUserInfo()
          refetchPendingLand()
          setScreenLoadingStatus("Withdraw Transaction success")
        } else {
          setScreenLoadingStatus("Transaction failed")
        }
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
  }, [withdrawTx, withdrawSuccess])

  useEffect(() => {
    try {
      if (approveTx) {
        if (approveSuccess) {
          refetchAllowanceOfLpTokenV2OfVault()
          refetchAllowanceOfLpTokenV2OfMasterChef()
  
          setScreenLoadingStatus("Approve Transaction success")
        } else {
          setScreenLoadingStatus("Transaction failed")
        }
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
  }, [approveTx, approveSuccess])

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
    approve(MASTERCHEF_CONTRACT_ADDRESS[bsc.id], "1000000000000000000000000000000")
    updateStatus()
  }

  return {
    depositVault,
    withdrawVault,
    approveVault
  }
}
