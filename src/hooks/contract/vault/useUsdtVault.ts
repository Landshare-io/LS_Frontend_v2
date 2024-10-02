import { useEffect } from "react"
import { useWaitForTransactionReceipt } from "wagmi";
import { BigNumberish } from "ethers";
import { bsc } from "viem/chains";
import { Address } from "viem";
import { useGlobalContext } from "../../../context/GlobalContext";
import useDeposit from "../MasterchefContract/useDeposit";
import useWithdraw from "../MasterchefContract/useWithdraw";
import useBalanceOfRwaLp from "../RwaLpTokenContract/useBalanceOf";
import useApprove from "../RwaLpTokenContract/useApprove";
import useUserInfo from "../MasterchefContract/useUserInfo";
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useLpVault(address: Address | undefined) {
  const { setScreenLoadingStatus, notifyError } = useGlobalContext()
  const { deposit, data: depositTx } = useDeposit()
  const { withdraw, data: withdrawTx } = useWithdraw()
  const { approve, data: approveTx } = useApprove()
  const { data: rwaLpTokenBalance } = useBalanceOfRwaLp(address) as {
    data: BigNumberish,
    refetch: Function
  }
  const { data: vaultBalanceLsRwa } = useUserInfo({ userInfoId: 4, address }) as { data: [BigNumberish, BigNumberish], refetch: Function }
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

  const approveVault = () => {
    setScreenLoadingStatus("Approve Transaction in progress...")
    approve(MASTERCHEF_CONTRACT_ADDRESS, "1000000000000000000000000000000")
  }

  return {
    depositVault,
    withdrawVault,
    approveVault
  }
}
