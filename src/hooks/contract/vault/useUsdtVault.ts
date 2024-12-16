import { useEffect } from "react"
import { useWaitForTransactionReceipt } from "wagmi";
import { BigNumberish } from "ethers";
import { Address } from "viem";
import { bsc } from "viem/chains";
import { useGlobalContext } from "../../../context/GlobalContext";
import useDeposit from "../MasterchefContract/useDeposit";
import useWithdraw from "../MasterchefContract/useWithdraw";
import useBalanceOfRwaLp from "../RwaLpTokenContract/useBalanceOf";
import useApprove from "../RwaLpTokenContract/useApprove";
import useUserInfo from "../MasterchefContract/useUserInfo";
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import useAllowance from "../RwaLpTokenContract/useAllowance";

export default function useUsdtVault(chainId: number, address: Address | undefined) {
  const { setScreenLoadingStatus, notifyError } = useGlobalContext()
  const { deposit, data: depositTx, isError: isDepositError } = useDeposit(chainId)
  const { withdraw, data: withdrawTx, isError: isWithdrawError } = useWithdraw(chainId)
  const { approve, data: approveTx, isError: isApproveError } = useApprove()
  const { data: rwaLpTokenBalance } = useBalanceOfRwaLp(chainId, address) as {
    data: BigNumberish,
    refetch: Function
  }
  const { refetch: refetchLSRWALPAllowance } = useAllowance(chainId, address, MASTERCHEF_CONTRACT_ADDRESS[bsc.id]) as { refetch: () => void }
  const { data: vaultBalanceLsRwa } = useUserInfo({ chainId, userInfoId: 4, address }) as { data: [BigNumberish, BigNumberish], refetch: Function }
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
      if (isDepositError) {
        setScreenLoadingStatus("Transaction failed")
      } else if (depositTx) {
        if (depositStatusData) {
          if (depositSuccess) {
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
        if (!isDepositError)
          setScreenLoadingStatus("")
      }, 1000);
    }
  }, [depositTx, depositStatusData, depositSuccess, isDepositError])

  useEffect(() => {
    try {
      if (isWithdrawError) {
        setScreenLoadingStatus("Transaction failed")
      } else if (withdrawTx) {
        if (withdrawStatusData) {
          if (withdrawSuccess) {
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
        if (!isWithdrawError)
          setScreenLoadingStatus("")
      }, 1000);
    }
  }, [withdrawTx, withdrawStatusData, withdrawSuccess, isWithdrawError])

  useEffect(() => {
    try {
      if (isApproveError) {
        setScreenLoadingStatus("Transaction failed")
      } else if (approveTx) {
        if (approveStatusData) {
          if (approveSuccess) {
            refetchLSRWALPAllowance()
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
        if (!isApproveError)
          setScreenLoadingStatus("")
      }, 1000);
    }
  }, [approveTx, approveStatusData, approveSuccess, isApproveError])

  const depositVault = (amount: BigNumberish) => {
    if (amount > rwaLpTokenBalance) {
      window.alert("Insufficient Balance");
      return;
    }

    setScreenLoadingStatus("Deposit Transaction in progress...")
    deposit(4, amount)
  }

  const withdrawVault = (amount: BigNumberish) => {
    if (Number(vaultBalanceLsRwa[0]) === 0) {
      notifyError("No enough balance");
      return;
    }
    if (vaultBalanceLsRwa[0] < amount) {
      notifyError("Insufficient deposit amount");
      return;
    }

    setScreenLoadingStatus("Withdraw Transaction in progress...")
    withdraw(4, amount)
  }

  const approveVault = (amount: BigNumberish) => {
    setScreenLoadingStatus("Approve Transaction in progress...")
    approve(chainId, MASTERCHEF_CONTRACT_ADDRESS[bsc.id], amount)
  }

  return {
    depositVault,
    withdrawVault,
    approveVault
  }
}
