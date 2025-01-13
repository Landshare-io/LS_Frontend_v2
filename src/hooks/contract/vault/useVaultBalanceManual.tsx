import { useEffect } from "react"
import { useWaitForTransactionReceipt } from "wagmi";
import { formatEther, BigNumberish } from "ethers";
import { Address } from "viem";
import { useGlobalContext } from "../../../context/GlobalContext";
import useDeposit from "../MasterchefContract/useDeposit";
import useWithdraw from "../MasterchefContract/useWithdraw";
import useBalanceOfLandToken from "../LandTokenContract/useBalanceOf";
import useAllowanceOfLandToken from "../LandTokenContract/useAllowance";
import useApprove from "../LandTokenContract/useApprove";
import useTotalStaked from "../MasterchefContract/useTotalStaked";
import useUserInfo from "../MasterchefContract/useUserInfo";
import usePendingLand from "../MasterchefContract/usePendingLand";
import { 
  AUTO_VAULT_V3_CONTRACT_ADDRESS, 
  MASTERCHEF_CONTRACT_ADDRESS,
  TRANSACTION_CONFIRMATIONS_COUNT
} from "../../../config/constants/environments";

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
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: depositTx,
    chainId: chainId
  });
  const { isSuccess: withdrawSuccess, data: withdraswStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: withdrawTx,
    chainId: chainId
  });
  const { isSuccess: approveSuccess, data: approveStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: approveTx,
    chainId: chainId
  });

  useEffect(() => {
    try {
      if (isDepositError) {
        setScreenLoadingStatus("Transaction Failed.")
      } else if (depositTx) {
        if (depositStatusData) {
          if (depositSuccess) {
            refetchLandToken()
            refetchAllowanceOfLandTokenOfVault()
            refetchAllowanceOfLandTokenOfMasterChef()
            refetchUserInfo()
            setScreenLoadingStatus("Transaction Complete.")
          } else {
            setScreenLoadingStatus("Transaction Failed.")
          }
        }
      }
    } catch (error) {
      setScreenLoadingStatus("Transaction Failed.")
      console.log(error)
    }
  }, [depositTx, depositStatusData, depositSuccess, isDepositError])

  useEffect(() => {
    try {
      if (isWithdrawError) {
        setScreenLoadingStatus("Transaction Failed.")
      } else if (withdrawTx) {
        if (withdraswStatusData) {
          if (withdrawSuccess) {
            refetchLandToken()
            refetchTotalStaked()
            refetchUserInfo()
            refetchPendingLand()
            setScreenLoadingStatus("Withdraw Transaction Complete.")
          } else {
            setScreenLoadingStatus("Transaction Failed.")
          }
        }
      }
    } catch (error) {
      setScreenLoadingStatus("Transaction Failed.")
      console.log(error)
    }
  }, [withdrawTx, withdraswStatusData, withdrawSuccess, isWithdrawError])

  useEffect(() => {
    try {
      if (isApproveError) {
        setScreenLoadingStatus("Transaction Failed.")
      } else if (approveTx) {
        if (approveStatusData) {
          if (approveSuccess) {
            refetchAllowanceOfLandTokenOfVault()
            refetchAllowanceOfLandTokenOfMasterChef()
    
            setScreenLoadingStatus("Approve Transaction Complete.")
          } else {
            setScreenLoadingStatus("Transaction Failed.")
          }
        }
      }
    } catch (error) {
      setScreenLoadingStatus("Transaction Failed.")
      console.log(error)
    }
  }, [approveTx, approveStatusData, approveSuccess, isApproveError])

  const depositVault = (amount: BigNumberish) => {
    if (Number(formatEther(amount)) > Number(formatEther(landTokenV2Balance))) {
      window.alert("Insufficient Balance");
      return;
    }

    setScreenLoadingStatus("Transaction Pending...")
    deposit(0, amount)
  }

  const withdrawVault = (amount: BigNumberish) => {
    setScreenLoadingStatus("Withdraw Transaction Pending...")
    withdraw(0, amount)
  }

  const approveVault = (amount: BigNumberish) => {
    setScreenLoadingStatus("Approve Transaction Pending...")
    approve(chainId, MASTERCHEF_CONTRACT_ADDRESS[chainId], amount)
    updateStatus()
  }

  return {
    depositVault,
    withdrawVault,
    approveVault
  }
}
