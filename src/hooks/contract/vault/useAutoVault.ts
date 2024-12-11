import { useEffect, useState } from "react"
import { useWaitForTransactionReceipt, useBalance } from "wagmi";
import { BigNumberish } from "ethers";
import { bsc, bscTestnet } from "viem/chains";
import { Address, formatEther } from "viem";
import { useGlobalContext } from "../../../context/GlobalContext";
import useDeposit from "../AutoVaultV3Contract/useDeposit";
import useBalanceOfLandToken from "../LandTokenContract/useBalanceOf";
import useUserInfo from "../MasterchefContract/useUserInfo";
import usePendingLand from "../MasterchefContract/usePendingLand";
import useTotalSupply from "../LpTokenV2Contract/useTotalSupply";
import useBalanceOfWBNB from "../WBNBTokenContract/useBalanceOf";
import { updateCcipTransaction } from "../../../lib/slices/contract-slices/APIConsumerCcipTransactions";
import { useAppDispatch } from "../../../lib/hooks";
import useCcipVaultBalance from "../CrossChainVault/useCcipVaultBalance";
import useAutoLandV3 from "../AutoVaultV3Contract/useAutoLandV3";
import useAllowanceOfLandToken from "../LandTokenContract/useAllowance";
import useApproveLandToken from "../LandTokenContract/useApprove";
import useTransfer from "../CcipChainSenderContract/useTransfer";
import useWithdrawAll from "../AutoVaultV3Contract/useWithdrawAll";
import useWithdraw from "../AutoVaultV3Contract/useWithdraw";
import useHarvest from "../AutoVaultV3Contract/useHarvest";
import { 
  PROVIDERS,
  MAJOR_WORK_CHAIN,
  CCIP_CHAIN_SENDER_CONTRACT_ADDRESS, 
  GAS_COSTS, 
  CCIP_CHAIN_ID, 
  LP_TOKEN_V2_CONTRACT_ADDRESS, 
  AUTO_VAULT_V3_CONTRACT_ADDRESS,
  IS_TEST_MODE
} from "../../../config/constants/environments";


export default function useAutoVault(chainId: number, address: Address | undefined) {
  const [isCcipDeposit, setIsCcipDeposit] = useState(false)
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
  const { data: ccipAllowance } = useAllowanceOfLandToken(chainId, address, CCIP_CHAIN_SENDER_CONTRACT_ADDRESS[chainId]) as { data: BigNumberish }
  const { approve: approveLand, data: approveLandTx } = useApproveLandToken()
  const { isSuccess: approveLandSuccess, data: approveStatusData } = useWaitForTransactionReceipt({
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
  const { isSuccess: transferSuccess, refetch: refetchTransferTx, data: transferStatusData } = useWaitForTransactionReceipt({
    hash: transferTx,
    chainId: chainId
  });
  const { isSuccess: withdrawAllSuccess, data: withdrawAllStatusData } = useWaitForTransactionReceipt({
    hash: withdrawAllTx,
    chainId: chainId
  });
  const { isSuccess: depositSuccess, data: depositStatusData } = useWaitForTransactionReceipt({
    hash: depositTx,
    chainId: chainId
  });
  const { isSuccess: withdrawSuccess, data: withdrawStatusData } = useWaitForTransactionReceipt({
    hash: withdrawTx,
    chainId: chainId
  });
  const { isSuccess: harvestSuccess, data: harvestStatusData } = useWaitForTransactionReceipt({
    hash: harvestTx,
    chainId: chainId
  });

  useEffect(() => {
    if (approveLandTx) {
      if (approveStatusData) {
        if (approveLandSuccess && isCcipDeposit) {
          setScreenLoadingStatus("Transaction in progress...")
          setIsCcipDeposit(false)
          transfer(chainId, depositAmount, 0, 0, 500000)
        }
      }
    }
  }, [approveLandTx, approveStatusData, approveLandSuccess])

  useEffect(() => {
    if (harvestTx) {
      if (harvestStatusData) {
        if (harvestSuccess) {
          setScreenLoadingStatus("Claim Harvest Transaction success")
        } else {
          setScreenLoadingStatus("Claim Harvest Transaction failed")
        }
      }
    }
  }, [harvestTx, harvestStatusData, harvestSuccess])

  useEffect(() => {
    if (withdrawAllTx) {
      if (withdrawAllStatusData) {
        if (withdrawAllSuccess) {
          setScreenLoadingStatus("Deposit Transaction success")
        } else {
          setScreenLoadingStatus("Transaction failed")
        }
      }
    }

    return () => {
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000);
    }
  }, [withdrawAllTx, withdrawAllStatusData, withdrawAllSuccess])

  useEffect(() => {
    if (transferTx) {
      if (transferStatusData) {
        if (transferSuccess) {
          const receiptTx = PROVIDERS[chainId].getTransactionReceipt(transferTx);
          const messageId = receiptTx?.events.filter((item: any) => item.hasOwnProperty('args')).map((item: any) => item.args)[0][0]
          dispatch(updateCcipTransaction({
            walletAddress: address,
            status: 'PENDING',
            action: transferAction,
            messageId,
            sourceChain: CCIP_CHAIN_ID[chainId],
            destinationChain: CCIP_CHAIN_ID[IS_TEST_MODE ? bscTestnet.id : bsc.id]
          }))
          setScreenLoadingStatus(`${transferAction} Transaction success`)
        } else {
          setScreenLoadingStatus("Transaction failed")
        }
      }
    }

    return () => {
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000);
    }
  }, [transferTx, transferStatusData, transferSuccess])

  useEffect(() => {
    try {
      if (depositTx) {
        if (depositStatusData) {
          if (depositSuccess) {
            refetchTotalSupply()
            refetchBalanceOfWBNB()
            refetchUserInfo()
            refetchPendingLand()
            refetchBalanceOfLandToken()
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
            refetchUserInfo()
            refetchPendingLand()
            refetchBalanceOfLandToken()
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
      if (approveLandTx) {
        if (approveStatusData) {
          if (approveLandSuccess) {
            refetchTotalSupply()
            refetchBalanceOfWBNB()
            refetchUserInfo()
            refetchPendingLand()
            refetchBalanceOfLandToken()
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
  }, [approveLandTx, approveStatusData, approveLandSuccess])

  const depositVault = (amount: BigNumberish) => {
    setDepositAmount(amount)
    setTransferAction('Deposit')
    if (amount > landTokenBalance) {
      notifyError('Insufficient Balance')
      return
    }

    if (!(MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId) && (Number(GAS_COSTS[chainId]) > Number(formatEther(BigInt(gasBalance?.value ?? 0))))) {
      notifyError('Insufficient Funds for Gas')
      return
    }

    
    if (!(MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId)) {
      if (ccipAllowance < amount) {
        setIsCcipDeposit(true)
        approveLand(chainId, CCIP_CHAIN_SENDER_CONTRACT_ADDRESS[chainId], amount)
      }
      setScreenLoadingStatus("Deposit Transaction in progress...")
      transfer(chainId, amount, 0, 0, 500000)
    } else {
      setScreenLoadingStatus("Deposit Transaction in progress...")
      deposit(amount)
    }
  }


  const withdrawVault = (amount: BigNumberish) => {
    // check withdraw all
    if (!(MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId)) {
      setTransferAction('Withdraw All')
      if (amount == 0 || amount == ccipAutoLandV3) {
        if (!(MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId) && (Number(GAS_COSTS[chainId]) > Number(formatEther(BigInt(gasBalance?.value ?? 0))))) {
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
    if (!(MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId)) {
      if (!(MAJOR_WORK_CHAIN.map(chain => chain.id) as number[]).includes(chainId) && (Number(GAS_COSTS[chainId]) > Number(formatEther(BigInt(gasBalance?.value ?? 0))))) {
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
    approveLand(chainId, AUTO_VAULT_V3_CONTRACT_ADDRESS[chainId], "1000000000000000000000000000000")
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
