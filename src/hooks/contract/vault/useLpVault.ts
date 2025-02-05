import { useEffect } from "react"
import { useWaitForTransactionReceipt } from "wagmi";
import { BigNumberish } from "ethers";
import { bsc } from "viem/chains";
import { Address } from "viem";
import { useGlobalContext } from "../../../context/GlobalContext";
import useDeposit from "../MasterchefContract/useDeposit";
import useWithdraw from "../MasterchefContract/useWithdraw";
import useBalanceOfLandToken from "../LandTokenContract/useBalanceOf";
import useBalanceOfLpTokenV2 from "../LpTokenV2Contract/useBalanceOf";
import useApprove from "../LpTokenV2Contract/useApprove";
import useAllowance from "../LpTokenV2Contract/useAllowance";
import useUserInfo from "../MasterchefContract/useUserInfo";
import usePendingLand from "../MasterchefContract/usePendingLand";
import useTotalSupply from "../LpTokenV2Contract/useTotalSupply";
import useBalanceOfWBNB from "../WBNBTokenContract/useBalanceOf";
import { 
  LP_TOKEN_V2_CONTRACT_ADDRESS, 
  MASTERCHEF_CONTRACT_ADDRESS,
  TRANSACTION_CONFIRMATIONS_COUNT
} from "../../../config/constants/environments";

export default function useLpVault(chainId: number, address: Address | undefined, updateStatus: Function, updateLPFarm: Function) {
  const { setScreenLoadingStatus, notifyError } = useGlobalContext()
  const { deposit, data: depositTx, isError: isDepositError } = useDeposit(chainId)
  const { withdraw, data: withdrawTx, isError: isWithdrawError } = useWithdraw(chainId)
  const { approve, data: approveTx, isError: isApproveError } = useApprove(chainId)
  const { data: lpTokenV2Balance, refetch: refetchLpTokenV2 } = useBalanceOfLpTokenV2({ chainId, address: MASTERCHEF_CONTRACT_ADDRESS[bsc.id] }) as {
    data: BigNumberish,
    refetch: Function
  }
  const { refetch: refetchUserInfo } = useUserInfo({ chainId, userInfoId: 1, address })
  const { refetch: refetchPendingLand } = usePendingLand({ chainId, pendingLandId: 1, address })
  const { refetch: refetchTotalSupply } = useTotalSupply(chainId)
  const { refetch: refetchBalanceOfWBNB } = useBalanceOfWBNB({ chainId, address: LP_TOKEN_V2_CONTRACT_ADDRESS[bsc.id] })
  const { refetch: refetchBalanceOfLandToken } = useBalanceOfLandToken({ chainId, address })
  const { refetch: refetchAllowance } = useAllowance(chainId, address, MASTERCHEF_CONTRACT_ADDRESS[bsc.id]) as { refetch: () => void }

  const { isSuccess: depositSuccess, data: depositStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: depositTx,
    chainId: chainId
  });
  const { isSuccess: withdrawSuccess, data: withdrawStatusData } = useWaitForTransactionReceipt({
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
    (async () => {
      try {
        if (isDepositError) {
          setScreenLoadingStatus("Transaction Failed.")
        } else if (depositTx) {
          if (depositStatusData) {
            if (depositSuccess) {
              await refetchTotalSupply()
              await refetchBalanceOfWBNB()
              await refetchLpTokenV2()
              await refetchUserInfo()
              await refetchPendingLand()
              await refetchBalanceOfLandToken()
              await updateLPFarm()
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
    })()
  }, [depositTx, depositStatusData, depositSuccess, isDepositError])

  useEffect(() => {
    (async () => {
      try {
        if (isWithdrawError) {
          setScreenLoadingStatus("Transaction Failed.")
        } else if (withdrawTx) {
          if (withdrawStatusData) {
            if (withdrawSuccess) {
              await refetchTotalSupply()
              await refetchBalanceOfWBNB()
              await refetchLpTokenV2()
              await refetchUserInfo()
              await refetchPendingLand()
              await refetchBalanceOfLandToken()
              await updateLPFarm()
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
    })()
  }, [withdrawTx, withdrawStatusData, withdrawSuccess, isWithdrawError])

  useEffect(() => {
    (async () => {
      try {
        if (isApproveError) {
          setScreenLoadingStatus("Transaction Failed.")
        } else if (approveTx) {
          if (approveStatusData) {
            if (approveSuccess) {
              await refetchTotalSupply()
              await refetchBalanceOfWBNB()
              await refetchLpTokenV2()
              await refetchUserInfo()
              await refetchPendingLand()
              await refetchBalanceOfLandToken()
              await refetchAllowance()
              await updateLPFarm()
              await updateStatus()
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
    })()
  }, [approveTx, approveStatusData, approveSuccess, isApproveError])

  const depositVault = (amount: BigNumberish) => {
    if (amount > lpTokenV2Balance) {
      window.alert("Insufficient Balance");
      return;
    }

    setScreenLoadingStatus("Transaction Pending...")
    deposit(1, amount)
  }

  const withdrawVault = (depositBalanceLP: BigNumberish, amount: BigNumberish) => {
    if (Number(depositBalanceLP) === 0) {
      notifyError("No enough balance");
      return;
    }
    if (depositBalanceLP < amount) {
      notifyError("Insufficient deposit amount");
      return;
    }

    setScreenLoadingStatus("Transaction Pending...")
    withdraw(1, amount)
  }

  const approveVault = (amount: BigNumberish) => {
    setScreenLoadingStatus("Transaction Pending...")
    approve(MASTERCHEF_CONTRACT_ADDRESS[bsc.id], amount)
  }

  return {
    depositVault,
    withdrawVault,
    approveVault
  }
}
