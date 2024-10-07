import { useEffect, useState } from "react"
import { useWaitForTransactionReceipt, useBalance } from "wagmi";
import { BigNumberish } from "ethers";
import { bsc } from "viem/chains";
import { Address, formatEther } from "viem";
import { useGlobalContext } from "../../../context/GlobalContext";
import useDeposit from "../AutoVaultV2Contract/useDeposit";
import useBalanceOfLandToken from "../LandTokenContract/useBalanceOf";
import useUserInfo from "../MasterchefContract/useUserInfo";
import usePendingLand from "../MasterchefContract/usePendingLand";
import useTotalSupply from "../LpTokenV2Contract/useTotalSupply";
import useBalanceOfWBNB from "../WBNBTokenContract/useBalanceOf";
import { updateCcipTransaction } from "../../../lib/slices/contract-slices/APIConsumerCcipTransactions";
import { useAppDispatch } from "../../../lib/hooks";
import useCcipVaultBalance from "../CrossChainVault/useCcipVaultBalance";
import useAutoLandV3 from "../AutoVaultV2Contract/useAutoLandV3";
import useAllowanceOfLandToken from "../LandTokenContract/useAllowance";
import useApproveLandToken from "../LandTokenContract/useApprove";
import useTransfer from "../CcipChainSenderContract/useTransfer";
import useWithdrawAll from "../AutoVaultV2Contract/useWithdrawAll";
import useWithdraw from "../AutoVaultV2Contract/useWithdraw";
import useHarvest from "../AutoVaultV2Contract/useHarvest";
import { 
  PROVIDERS,
  MAJOR_WORK_CHAIN,
  CCIP_CHAIN_SENDER_CONTRACT_ADDRESS, 
  GAS_COSTS, 
  CCIP_CHAIN_ID, 
  LP_TOKEN_V2_CONTRACT_ADDRESS, 
  AUTO_VAULT_V3_CONTRACT_ADDRESS
} from "../../../config/constants/environments";


export default function useAutoVault(chainId: number, address: Address | undefined) {
  const [depositAmount, setDepositAmount] = useState<BigNumberish>(0)
  const [transferAction, setTransferAction] = useState('')
  const { setScreenLoadingStatus, notifyError } = useGlobalContext()
  const { deposit, data: depositTx } = useDeposit(chainId)
  const { withdraw, data: withdrawTx } = useWithdraw(chainId)
  const dispatch = useAppDispatch()
  const { withdrawAll, data: withdrawAllTx } = useWithdrawAll(chainId)
  const { harvest, data: harvestTx } = useHarvest(chainId)
  const { data: gasBalance } = useBalance({
    address,
    chainId
  })
  const ccipAllowance = useAllowanceOfLandToken(chainId, address, CCIP_CHAIN_SENDER_CONTRACT_ADDRESS[chainId]) as BigNumberish
  const { approve: approveLand, data: approveLandTx } = useApproveLandToken()
  const { isSuccess: approveLandSuccess } = useWaitForTransactionReceipt({
    hash: approveLandTx,
    chainId: chainId
  });
  const { 
    totalSharesV3,
    total,
    autoLandV3: ccipAutoLandV3 
  } = useCcipVaultBalance(chainId, address) as { totalSharesV3: BigNumberish, total: BigNumberish, autoLandV3: BigNumberish }
  const { autoLandV3 } = useAutoLandV3(chainId, address) as { autoLandV3: BigNumberish }
  const { refetch: refetchUserInfo } = useUserInfo({ chainId, userInfoId: 0, address })
  const { refetch: refetchPendingLand } = usePendingLand({ chainId, pendingLandId: 0, address })
  const { refetch: refetchTotalSupply } = useTotalSupply(chainId)
  const { refetch: refetchBalanceOfWBNB } = useBalanceOfWBNB({ chainId, address: LP_TOKEN_V2_CONTRACT_ADDRESS[bsc.id] })
  const { data: landTokenBalance, refetch: refetchBalanceOfLandToken } = useBalanceOfLandToken({ chainId, address }) as { data: BigNumberish, refetch: Function }
  const { transfer, data: transferTx } = useTransfer(chainId)
  const { isSuccess: transferSuccess, refetch: refetchTransferTx, data: receiptTx } = useWaitForTransactionReceipt({
    hash: transferTx,
    chainId: chainId
  });
  const { isSuccess: withdrawAllSuccess } = useWaitForTransactionReceipt({
    hash: withdrawAllTx,
    chainId: chainId
  });
  const { isSuccess: depositSuccess } = useWaitForTransactionReceipt({
    hash: depositTx,
    chainId: chainId
  });
  const { isSuccess: withdrawSuccess } = useWaitForTransactionReceipt({
    hash: withdrawTx,
    chainId: chainId
  });
  const { isSuccess: harvestSuccess } = useWaitForTransactionReceipt({
    hash: harvestTx,
    chainId: chainId
  });

  useEffect(() => {
    (async () => {
      if (approveLandSuccess) {
        setScreenLoadingStatus("Deposit Transaction in progress...")
        transfer(chainId, depositAmount, 0, 0, 500000)
      }
    })()
  }, [approveLandSuccess])

  useEffect(() => {
    if (harvestSuccess) {
      setScreenLoadingStatus("Claim Harvest Transaction success")
    } else {
      setScreenLoadingStatus("Claim Harvest Transaction failed")
    }
  }, [harvestSuccess])

  useEffect(() => {
    (async () => {
      if (withdrawAllSuccess) {
        setScreenLoadingStatus("Deposit Transaction success")
      } else {
        setScreenLoadingStatus("Transaction failed")
      }
    })()

    return () => {
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000);
    }
  }, [withdrawAllSuccess])

  useEffect(() => {
    (async () => {
      if (transferSuccess) {
        const receiptTx = await PROVIDERS[chainId].getTransactionReceipt(transferTx);
        const messageId = receiptTx?.events.filter((item: any) => item.hasOwnProperty('args')).map((item: any) => item.args)[0][0]
        dispatch(updateCcipTransaction({
          walletAddress: address,
          status: 'PENDING',
          action: transferAction,
          messageId,
          sourceChain: CCIP_CHAIN_ID[chainId],
          destinationChain: CCIP_CHAIN_ID[MAJOR_WORK_CHAIN.id]
        }))
        setScreenLoadingStatus(`${transferAction} Transaction success`)
      } else {
        setScreenLoadingStatus("Transaction failed")
      }
    })()

    return () => {
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000);
    }
  }, [transferSuccess])

  useEffect(() => {
    (async () => {
      try {
        if (depositSuccess) {
          await refetchTotalSupply()
          await refetchBalanceOfWBNB()
          await refetchUserInfo()
          await refetchPendingLand()
          await refetchBalanceOfLandToken()
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
          await refetchUserInfo()
          await refetchPendingLand()
          await refetchBalanceOfLandToken()
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
        if (approveLandSuccess) {
          await refetchTotalSupply()
          await refetchBalanceOfWBNB()
          await refetchUserInfo()
          await refetchPendingLand()
          await refetchBalanceOfLandToken()
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
  }, [approveLandSuccess])

  const depositVault = (amount: BigNumberish) => {
    setDepositAmount(amount)
    setTransferAction('Deposit')
    if (amount > landTokenBalance) {
      notifyError('Insufficient Balance')
      return
    }

    if (chainId !== MAJOR_WORK_CHAIN.id && (Number(GAS_COSTS[chainId]) > Number(formatEther(BigInt(gasBalance?.value ?? 0))))) {
      notifyError('Insufficient Funds for Gas')
      return
    }

    
    if (chainId !== MAJOR_WORK_CHAIN.id) {
      if (ccipAllowance < amount) {
        approveLand(chainId, CCIP_CHAIN_SENDER_CONTRACT_ADDRESS[chainId], amount)
      }
      setScreenLoadingStatus("Deposit Transaction in progress...")
      transfer(chainId, amount, 0, 0, 500000)
    } else {
      deposit(amount)
    }
  }


  const withdrawVault = (amount: BigNumberish) => {
    // check withdraw all
    if (chainId != MAJOR_WORK_CHAIN.id) {
      setTransferAction('Withdraw All')
      if (amount == 0 || amount == ccipAutoLandV3) {
        if (chainId !== MAJOR_WORK_CHAIN.id && (Number(GAS_COSTS[chainId]) > Number(formatEther(BigInt(gasBalance?.value ?? 0))))) {
          notifyError('Insufficient Funds for Gas')
          return
        }
        setScreenLoadingStatus("Withdraw All Transaction in progress...")
        transfer(chainId, 1, 2, 0, 750000) // withdraw all of ccip
      }
    } else {
      if (amount == 0 || amount == autoLandV3) {
        setScreenLoadingStatus("Withdraw All Transaction in progress...")
        withdrawAll()
      }
    }

    setTransferAction('Withdraw')
    if (chainId != MAJOR_WORK_CHAIN.id) {
      if (chainId !== MAJOR_WORK_CHAIN.id && (Number(GAS_COSTS[chainId]) > Number(formatEther(BigInt(gasBalance?.value ?? 0))))) {
        notifyError('Insufficient Funds for Gas')
        return
      }

      const withdrawAmount = BigInt(amount) * BigInt(totalSharesV3) / BigInt(total)
      setScreenLoadingStatus("Withdraw Transaction in progress...")
      transfer(chainId, withdrawAmount, 1, 0, 750000)
    } else {
      setScreenLoadingStatus("Withdraw Transaction in progress...")
      withdraw(amount)
    }
  }

  const approveVault = () => {
    setScreenLoadingStatus("Approve Transaction in progress...")
    approveLand(chainId, AUTO_VAULT_V3_CONTRACT_ADDRESS[bsc.id], "1000000000000000000000000000000")
  }

  const clainBounty = () => {
    setScreenLoadingStatus("Claim Harvest Transaction in progress...")
    harvest()
  }

  return {
    depositVault,
    withdrawVault,
    approveVault,
    clainBounty
  }
}
