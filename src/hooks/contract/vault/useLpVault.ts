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

export default function useLpVault(address: Address | undefined, updateStatus: Function, updateLPFarm: Function) {
  const { setScreenLoadingStatus, notifyError } = useGlobalContext()
  const { deposit, data: depositTx } = useDeposit()
  const { withdraw, data: withdrawTx } = useWithdraw()
  const { approve, data: approveTx } = useApprove()
  const { data: lpTokenV2Balance, refetch: refetchLpTokenV2 } = useBalanceOfLpTokenV2({ address: MASTERCHEF_CONTRACT_ADDRESS }) as {
    data: BigNumberish,
    refetch: Function
  }
  const { refetch: refetchUserInfo } = useUserInfo({ userInfoId: 0, address })
  const { refetch: refetchPendingLand } = usePendingLand({ pendingLandId: 0, address })
  const { refetch: refetchTotalSupply } = useTotalSupply()
  const { refetch: refetchBalanceOfWBNB } = useBalanceOfWBNB({ address: LP_TOKEN_V2_CONTRACT_ADDRESS })
  const { refetch: refetchBalanceOfLandToken } = useBalanceOfLandToken({ chainId: bsc.id, address })

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
    (async () => {
      try {
        if (depositSuccess) {
          await refetchTotalSupply()
          await refetchBalanceOfWBNB()
          await refetchLpTokenV2()
          await refetchUserInfo()
          await refetchPendingLand()
          await refetchBalanceOfLandToken()
          await updateLPFarm()
          setScreenLoadingStatus("Deposit Transaction success")
        } else {
          setScreenLoadingStatus("Transaction failed")
        }
      } catch (error) {
        setScreenLoadingStatus("Transaction failed")
        console.log(error)
      }
    })()

    return () => {
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000);
    }
  }, [depositSuccess])

  useEffect(() => {
    (async () => {
      try {
        if (withdrawSuccess) {
          await refetchTotalSupply()
          await refetchBalanceOfWBNB()
          await refetchLpTokenV2()
          await refetchUserInfo()
          await refetchPendingLand()
          await refetchBalanceOfLandToken()
          await updateLPFarm()
          setScreenLoadingStatus("Withdraw Transaction success")
        } else {
          setScreenLoadingStatus("Transaction failed")
        }
      } catch (error) {
        setScreenLoadingStatus("Transaction failed")
        console.log(error)
      }
    })()

    return () => {
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000);
    }
  }, [withdrawSuccess])

  useEffect(() => {
    (async () => {
      try {
        if (approveSuccess) {
          await refetchTotalSupply()
          await refetchBalanceOfWBNB()
          await refetchLpTokenV2()
          await refetchUserInfo()
          await refetchPendingLand()
          await refetchBalanceOfLandToken()
          await updateLPFarm()
          await updateStatus()
          setScreenLoadingStatus("Approve Transaction success")
        } else {
          setScreenLoadingStatus("Transaction failed")
        }
      } catch (error) {
        setScreenLoadingStatus("Transaction failed")
        console.log(error)
      }
    })()

    return () => {
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000);
    }
  }, [approveSuccess])

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
    approve(MASTERCHEF_CONTRACT_ADDRESS, lpTokenV2Balance)
  }

  return {
    depositVault,
    withdrawVault,
    approveVault
  }
}
