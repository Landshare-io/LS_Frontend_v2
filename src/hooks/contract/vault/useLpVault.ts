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
import useUserInfo from "../MasterchefContract/useUserInfo";
import usePendingLand from "../MasterchefContract/usePendingLand";
import useTotalSupply from "../LpTokenV2Contract/useTotalSupply";
import useBalanceOfWBNB from "../WBNBTokenContract/useBalanceOf";
import { LP_TOKEN_V2_CONTRACT_ADDRESS, MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useLpVault(chainId: number, address: Address | undefined, updateStatus: Function, updateLPFarm: Function) {
  const { setScreenLoadingStatus, notifyError } = useGlobalContext()
  const { deposit, data: depositTx } = useDeposit(chainId)
  const { withdraw, data: withdrawTx } = useWithdraw(chainId)
  const { approve, data: approveTx } = useApprove(chainId)
  const { data: lpTokenV2Balance, refetch: refetchLpTokenV2 } = useBalanceOfLpTokenV2({ chainId, address: MASTERCHEF_CONTRACT_ADDRESS[bsc.id] }) as {
    data: BigNumberish,
    refetch: Function
  }
  const { refetch: refetchUserInfo } = useUserInfo({ chainId, userInfoId: 0, address })
  const { refetch: refetchPendingLand } = usePendingLand({ chainId, pendingLandId: 0, address })
  const { refetch: refetchTotalSupply } = useTotalSupply(chainId)
  const { refetch: refetchBalanceOfWBNB } = useBalanceOfWBNB({ chainId, address: LP_TOKEN_V2_CONTRACT_ADDRESS[bsc.id] })
  const { refetch: refetchBalanceOfLandToken } = useBalanceOfLandToken({ chainId, address })

  const { isSuccess: depositSuccess, data: depositStatusData } = useWaitForTransactionReceipt({
    hash: depositTx,
    chainId: chainId
  });
  const { isSuccess: withdrawSuccess, data: withdrawStatusData } = useWaitForTransactionReceipt({
    hash: withdrawTx,
    chainId: chainId
  });
  const { isSuccess: approveSuccess, data: approveStatusData } = useWaitForTransactionReceipt({
    hash: approveTx,
    chainId: chainId
  });

  useEffect(() => {
    try {
      if (depositTx) {
        if (depositStatusData) {
          if (depositSuccess) {
            refetchTotalSupply()
            refetchBalanceOfWBNB()
            refetchLpTokenV2()
            refetchUserInfo()
            refetchPendingLand()
            refetchBalanceOfLandToken()
            updateLPFarm()
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
  }, [depositTx, depositStatusData, depositSuccess])

  useEffect(() => {
    try {
      if (withdrawTx) {
        if (withdrawStatusData) {
          if (withdrawSuccess) {
            refetchTotalSupply()
            refetchBalanceOfWBNB()
            refetchLpTokenV2()
            refetchUserInfo()
            refetchPendingLand()
            refetchBalanceOfLandToken()
            updateLPFarm()
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
  }, [withdrawTx, withdrawStatusData, withdrawSuccess])

  useEffect(() => {
    try {
      if (approveTx) {
        if (approveStatusData) {
          if (approveSuccess) {
            refetchTotalSupply()
            refetchBalanceOfWBNB()
            refetchLpTokenV2()
            refetchUserInfo()
            refetchPendingLand()
            refetchBalanceOfLandToken()
            updateLPFarm()
            updateStatus()
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
  }, [approveTx, approveStatusData, approveSuccess])

  const depositVault = (amount: BigNumberish) => {
    if (amount > lpTokenV2Balance) {
      window.alert("Insufficient Balance");
      return;
    }

    setScreenLoadingStatus("Deposit Transaction in progress...")
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

    setScreenLoadingStatus("Withdraw Transaction in progress...")
    withdraw(1, amount)
  }

  const approveVault = () => {
    setScreenLoadingStatus("Approve Transaction in progress...")
    approve(MASTERCHEF_CONTRACT_ADDRESS[bsc.id], lpTokenV2Balance)
  }

  return {
    depositVault,
    withdrawVault,
    approveVault
  }
}
