import { useEffect, useState } from "react"
import { useWaitForTransactionReceipt, useBalance } from "wagmi";
import { BigNumberish } from "ethers";
import { bsc } from "viem/chains";
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
  AUTO_VAULT_MAIN_CHAINS,
  CCIP_CHAIN_SENDER_CONTRACT_ADDRESS, 
  GAS_COSTS, 
  CCIP_CHAIN_ID, 
  LP_TOKEN_V2_CONTRACT_ADDRESS, 
  AUTO_VAULT_V3_CONTRACT_ADDRESS
} from "../../../config/constants/environments";

export default function useAutoVault(chainId: number, address: Address | undefined) {
  const [isCcipDeposit, setIsCcipDeposit] = useState(false)
  const [depositAmount, setDepositAmount] = useState<BigNumberish>(0)
  const [transferAction, setTransferAction] = useState('')
  const { setScreenLoadingStatus, notifyError } = useGlobalContext()
  const { deposit, data: depositTx, isError: isDepositError} = useDeposit(chainId)
  const { withdraw, data: withdrawTx, isError: isWithdrawError } = useWithdraw(chainId)
  const dispatch = useAppDispatch()
  const { withdrawAll, data: withdrawAllTx, isError: isWithdrawAllError } = useWithdrawAll(chainId)
  const { harvest, data: harvestTx, isError: isHarvestError } = useHarvest(chainId)
  const { data: gasBalance } = useBalance({
    address,
    chainId
  })
  const { data: ccipAllowance, refetch: refetchAllowance } = useAllowanceOfLandToken(chainId, address, CCIP_CHAIN_SENDER_CONTRACT_ADDRESS[chainId]) as { data: BigNumberish, refetch: Function }
  const { approve: approveLand, data: approveLandTx, isError: isApproveError } = useApproveLandToken()
  const { isSuccess: approveLandSuccess, data: approveStatusData } = useWaitForTransactionReceipt({
    hash: approveLandTx,
    chainId: chainId
  });
  const { 
    totalSharesV3,
    total,
    autoLandV3: ccipAutoLandV3 
  } = useCcipVaultBalance(chainId, address) as { totalSharesV3: BigNumberish, total: BigNumberish, autoLandV3: BigNumberish }
  const { autoLandV3, refetch: refetchAutoLandV3 } = useAutoLandV3(chainId, address) as { autoLandV3: BigNumberish, refetch: Function }
  const { refetch: refetchUserInfo } = useUserInfo({ chainId, userInfoId: 0, address })
  const { refetch: refetchPendingLand } = usePendingLand({ chainId, pendingLandId: 0, address })
  const { refetch: refetchTotalSupply } = useTotalSupply(chainId)
  const { refetch: refetchBalanceOfWBNB } = useBalanceOfWBNB({ chainId, address: LP_TOKEN_V2_CONTRACT_ADDRESS[bsc.id] })
  const { data: landTokenBalance, refetch: refetchBalanceOfLandToken } = useBalanceOfLandToken({ chainId, address }) as { data: BigNumberish, refetch: Function }
  const { transfer, data: transferTx, isError: isTransferError } = useTransfer(chainId)
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
    try {
      if (isApproveError) {
        setIsCcipDeposit(false)
        setScreenLoadingStatus("Transaction Failed.")
      } else if (approveLandTx) {
        if (approveStatusData) {
          if (approveLandSuccess && !isCcipDeposit) {
            refetchTotalSupply()
            refetchBalanceOfWBNB()
            refetchUserInfo()
            refetchPendingLand()
            refetchBalanceOfLandToken()
            refetchAllowance()
            setScreenLoadingStatus("Approve Transaction Complete.")
          } else if (approveLandSuccess && isCcipDeposit) {
            setScreenLoadingStatus("Transaction in progress...")
            setIsCcipDeposit(false)
            transfer(chainId, depositAmount, 0, 0, 500000)
          } else {
            setIsCcipDeposit(false)
            setScreenLoadingStatus("Transaction Failed.")
          }        
        }
      }
    } catch (error) {
      setIsCcipDeposit(false)
      setScreenLoadingStatus("Transaction Failed.")
      console.log(error)
    }
  }, [approveLandTx, approveStatusData, approveLandSuccess, isApproveError])

  useEffect(() => {
    try {
      if (isHarvestError) {
        setScreenLoadingStatus("Transaction Failed.")
      } else if (harvestTx) {
        if (harvestStatusData) {
          if (harvestSuccess) {
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
  }, [harvestTx, harvestStatusData, harvestSuccess, isHarvestError])

  useEffect(() => {
    try {
      if (isWithdrawAllError) {
        setScreenLoadingStatus("Transaction Failed.")
      } else if (withdrawAllTx) {
        if (withdrawAllStatusData) {
          if (withdrawAllSuccess) {
            setScreenLoadingStatus("Transaction Complete.")
            refetchAutoLandV3()
          } else {
            setScreenLoadingStatus("Transaction Failed.")
          }
        }
      }
    } catch (error) {
      setScreenLoadingStatus("Transaction Failed.")
      console.log(error)
    }
  }, [withdrawAllTx, withdrawAllStatusData, withdrawAllSuccess, isWithdrawAllError])

  useEffect(() => {
    try {
      if (isTransferError) {
        setScreenLoadingStatus("Transaction Failed.")
      } else if (transferTx) {
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
              destinationChain: CCIP_CHAIN_ID[AUTO_VAULT_MAIN_CHAINS[0].id]
            }))
            setScreenLoadingStatus(`${transferAction} Transaction Complete.`)
          } else {
            setScreenLoadingStatus("Transaction Failed.")
          }
        }
      }
    } catch (error) {
      setScreenLoadingStatus("Transaction Failed.")
      console.log(error)
    }
  }, [transferTx, transferStatusData, transferSuccess])

  useEffect(() => {
    try {
      if (isDepositError) {
        setScreenLoadingStatus("Transaction Failed.")
      } else if (depositTx) {
        if (depositStatusData) {
          if (depositSuccess) {
            refetchTotalSupply()
            refetchBalanceOfWBNB()
            refetchUserInfo()
            refetchPendingLand()
            refetchBalanceOfLandToken()
            refetchAutoLandV3()
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
            refetchTotalSupply()
            refetchBalanceOfWBNB()
            refetchUserInfo()
            refetchPendingLand()
            refetchBalanceOfLandToken()
            refetchAutoLandV3()
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
  }, [withdrawTx, withdrawStatusData, withdrawSuccess, isWithdrawError])

  const depositVault = (amount: BigNumberish) => {
    setDepositAmount(amount)
    setTransferAction('Deposit')
    if (amount > landTokenBalance) {
      notifyError('Insufficient Balance')
      return
    }

    if (!(AUTO_VAULT_MAIN_CHAINS.map(chain => chain.id) as number[]).includes(chainId) && (Number(GAS_COSTS[chainId]) > Number(formatEther(BigInt(gasBalance?.value ?? 0))))) {
      notifyError('Insufficient Funds for Gas')
      return
    }

    
    if (!(AUTO_VAULT_MAIN_CHAINS.map(chain => chain.id) as number[]).includes(chainId)) {
      if (ccipAllowance < amount) {
        setIsCcipDeposit(true)
        approveLand(chainId, CCIP_CHAIN_SENDER_CONTRACT_ADDRESS[chainId], amount)
      }
      setScreenLoadingStatus("Transaction Pending...")
      transfer(chainId, amount, 0, 0, 500000)
    } else {
      setScreenLoadingStatus("Transaction Pending...")
      deposit(amount)
    }
  }


  const withdrawVault = (amount: BigNumberish, rawInput: BigNumberish) => {
    // check withdraw all
    if (!(AUTO_VAULT_MAIN_CHAINS.map(chain => chain.id) as number[]).includes(chainId)) {
      setTransferAction('Withdraw All')
      if (amount == 0 || amount == ccipAutoLandV3) {
        if ((!(AUTO_VAULT_MAIN_CHAINS.map(chain => chain.id) as number[]).includes(chainId)) && (Number(GAS_COSTS[chainId]) > Number(formatEther(BigInt(gasBalance?.value ?? 0))))) {
          notifyError('Insufficient Funds for Gas')
          return
        }
        setScreenLoadingStatus("Transaction Pending...")
        transfer(chainId, 1, 2, 0, 750000) // withdraw all of ccip
      }
    } else {
      if (rawInput == 0 || rawInput == autoLandV3) {
        setScreenLoadingStatus("Transaction Pending...")
        withdrawAll()
      }
    }

    setTransferAction('Withdraw')
    if (!(AUTO_VAULT_MAIN_CHAINS.map(chain => chain.id) as number[]).includes(chainId)) {
      if ((!(AUTO_VAULT_MAIN_CHAINS.map(chain => chain.id) as number[]).includes(chainId)) && (Number(GAS_COSTS[chainId]) > Number(formatEther(BigInt(gasBalance?.value ?? 0))))) {
        notifyError('Insufficient Funds for Gas')
        return
      }

      // const withdrawAmount = BigInt(amount) * BigInt(totalSharesV3) / BigInt(total)
      setScreenLoadingStatus("Transaction Pending...")
      transfer(chainId, amount, 1, 0, 750000)
    } else {
      setScreenLoadingStatus("Transaction Pending...")
      withdraw(amount)
    }
  }

  const approveVault = (amount: BigNumberish) => {
    setScreenLoadingStatus("Transaction Pending...")
    approveLand(chainId, AUTO_VAULT_V3_CONTRACT_ADDRESS[chainId], amount)
  }

  const clainBounty = () => {
    setScreenLoadingStatus("Transaction Pending...")
    harvest()
  }

  return {
    depositVault,
    withdrawVault,
    approveVault,
    clainBounty
  }
}
