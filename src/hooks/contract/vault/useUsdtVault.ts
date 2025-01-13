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
import { MASTERCHEF_CONTRACT_ADDRESS, TRANSACTION_CONFIRMATIONS_COUNT } from "../../../config/constants/environments";
import useAllowance from "../RwaLpTokenContract/useAllowance";

export default function useUsdtVault(chainId: number, address: Address | undefined) {
  const { setScreenLoadingStatus, notifyError } = useGlobalContext()
  const { deposit, data: depositTx, isError: isDepositError } = useDeposit(chainId)
  const { withdraw, data: withdrawTx, isError: isWithdrawError } = useWithdraw(chainId)
  const { approve, data: approveTx, isError: isApproveError } = useApprove()
  const { data: rwaLpTokenBalance, refetch: refetchrwaLpTokenBalance } = useBalanceOfRwaLp(chainId, address) as {
    data: BigNumberish,
    refetch: Function
  }
  const { refetch: refetchLSRWALPAllowance } = useAllowance(chainId, address, MASTERCHEF_CONTRACT_ADDRESS[bsc.id]) as { refetch: Function }
  const { data: vaultBalanceLsRwa, refetch: refetchUserInfo } = useUserInfo({ chainId, userInfoId: 4, address }) as { data: [BigNumberish, BigNumberish], refetch: Function }
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
    try {
      if (isDepositError) {
        setScreenLoadingStatus("Transaction Failed.")
      } else if (depositTx) {
        if (depositStatusData) {
          if (depositSuccess) {
            refetchrwaLpTokenBalance()
            refetchUserInfo();
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
        if (withdrawStatusData) {
          if (withdrawSuccess) {
            refetchrwaLpTokenBalance()
            refetchUserInfo();
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
  }, [withdrawTx, withdrawStatusData, withdrawSuccess, isWithdrawError])

  useEffect(() => {
    try {
      if (isApproveError) {
        setScreenLoadingStatus("Transaction Failed.")
      } else if (approveTx) {
        if (approveStatusData) {
          if (approveSuccess) {
            refetchLSRWALPAllowance()
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
    if (amount > rwaLpTokenBalance) {
      window.alert("Insufficient Balance");
      return;
    }

    setScreenLoadingStatus("Transaction Pending...")
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

    setScreenLoadingStatus("Withdraw Transaction Pending...")
    withdraw(4, amount)
  }

  const approveVault = (amount: BigNumberish) => {
    setScreenLoadingStatus("Approve Transaction Pending...")
    approve(chainId, MASTERCHEF_CONTRACT_ADDRESS[bsc.id], amount)
  }

  return {
    depositVault,
    withdrawVault,
    approveVault
  }
}
