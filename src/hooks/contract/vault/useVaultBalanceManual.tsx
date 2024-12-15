import { useEffect } from "react"
import { useWaitForTransactionReceipt } from "wagmi";
import { formatEther, BigNumberish } from "ethers";
import { Address } from "viem";
import { bsc } from "viem/chains";
import { useGlobalContext } from "../../../context/GlobalContext";
import useDeposit from "../MasterchefContract/useDeposit";
import useWithdraw from "../MasterchefContract/useWithdraw";
import useBalanceOfLandToken from "../LandTokenContract/useBalanceOf";
import useAllowanceOfLandToken from "../LandTokenContract/useAllowance";
import useApprove from "../LandTokenContract/useApprove";
import useTotalStaked from "../MasterchefContract/useTotalStaked";
import useUserInfo from "../MasterchefContract/useUserInfo";
import usePendingLand from "../MasterchefContract/usePendingLand";
import { AUTO_VAULT_V3_CONTRACT_ADDRESS, MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useVaultBalanceManual(chainId: number, address: Address | undefined, updateStatus: Function) {
  const { setScreenLoadingStatus } = useGlobalContext()
  const { deposit, data: depositTx, isError: isDepositError } = useDeposit(chainId)
  const { withdraw, data: withdrawTx, isError: isWithdrawError } = useWithdraw(chainId)
  const { approve, data: approveTx, isError: isApproveError } = useApprove()
  const { data: landTokenV2Balance, refetch: refetchLandToken } = useBalanceOfLandToken({ chainId, address }) as {
    data: BigNumberish,
    refetch: Function
  }
  const { refetch: refetchAllowanceOfLandTokenOfVault } = useAllowanceOfLandToken(chainId, address, AUTO_VAULT_V3_CONTRACT_ADDRESS[chainId])
  const { refetch: refetchAllowanceOfLandTokenOfMasterChef } = useAllowanceOfLandToken(chainId, address, MASTERCHEF_CONTRACT_ADDRESS[chainId])
  const { refetch: refetchTotalStaked } = useTotalStaked(chainId)
  const { refetch: refetchUserInfo } = useUserInfo({ chainId, userInfoId: 0, address })
  const { refetch: refetchPendingLand } = usePendingLand({ chainId, pendingLandId: 0, address })

  const { isSuccess: depositSuccess, data: depositStatusData } = useWaitForTransactionReceipt({
    hash: depositTx,
    chainId: chainId
  });
  const { isSuccess: withdrawSuccess, data: withdraswStatusData } = useWaitForTransactionReceipt({
    hash: withdrawTx,
    chainId: chainId
  });
  const { isSuccess: approveSuccess, data: approveStatusData } = useWaitForTransactionReceipt({
    hash: approveTx,
    chainId: chainId
  });

  useEffect(() => {
    try {
      if (isDepositError) {
        setScreenLoadingStatus("Transaction failed")
      } else if (depositTx) {
        if (depositStatusData) {
          if (depositSuccess) {
            refetchLandToken()
            refetchAllowanceOfLandTokenOfVault()
            refetchAllowanceOfLandTokenOfMasterChef()
            refetchUserInfo()
            setScreenLoadingStatus("Deposit Transaction success")
          } else {
            setScreenLoadingStatus("Transaction failed")
          }
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
  }, [depositTx, depositStatusData, depositSuccess, isDepositError])

  useEffect(() => {
    try {
      if (isWithdrawError) {
        setScreenLoadingStatus("Transaction failed")
      } else if (withdrawTx) {
        if (withdraswStatusData) {
          if (withdrawSuccess) {
            refetchLandToken()
            refetchTotalStaked()
            refetchUserInfo()
            refetchPendingLand()
            setScreenLoadingStatus("Withdraw Transaction success")
          } else {
            setScreenLoadingStatus("Transaction failed")
          }
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
  }, [withdrawTx, withdraswStatusData, withdrawSuccess, isWithdrawError])

  useEffect(() => {
    try {
      if (isApproveError) {
        setScreenLoadingStatus("Transaction failed")
      } else if (approveTx) {
        if (approveStatusData) {
          if (approveSuccess) {
            refetchAllowanceOfLandTokenOfVault()
            refetchAllowanceOfLandTokenOfMasterChef()
    
            setScreenLoadingStatus("Approve Transaction success")
          } else {
            setScreenLoadingStatus("Transaction failed")
          }
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
  }, [approveTx, approveStatusData, approveSuccess, isApproveError])

  const depositVault = (amount: BigNumberish) => {
    if (Number(formatEther(amount)) > Number(formatEther(landTokenV2Balance))) {
      window.alert("Insufficient Balance");
      return;
    }

    setScreenLoadingStatus("Deposit Transaction in progress...")
    deposit(0, amount)
  }

  const withdrawVault = (amount: BigNumberish) => {
    setScreenLoadingStatus("Withdraw Transaction in progress...")
    withdraw(0, amount)
  }

  const approveVault = (amount: BigNumberish) => {
    setScreenLoadingStatus("Approve Transaction in progress...")
    approve(chainId, MASTERCHEF_CONTRACT_ADDRESS[chainId], amount)
    updateStatus()
  }

  return {
    depositVault,
    withdrawVault,
    approveVault
  }
}
