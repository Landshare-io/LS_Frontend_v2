import { useState, useEffect } from "react";
import { BigNumberish } from "ethers";
import { Address } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import axios from "./nft-game-axios";
import { useGlobalContext } from "../../../context/GlobalContext";
import useApprove from "../../contract/RWAContract/useApprove";
import useDeposit from "../../contract/AssetStakeContract/useDeposit";
import useStakedBalance from "../../contract/AssetStakeContract/useStakedBalance";
import { ASSET_STAKE_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import useGetUserData from "./useGetUserData";

export default function useStake(chainId: number, address: Address | undefined, setDepositLoading: Function) {
  const [depositAmount, setDepositAmount] = useState<BigNumberish>(0)
  const { approve, data: approveTx, isError: isApproveTxError } = useApprove(chainId)
  const { deposit, data: depositTx, isError: isDepositTxError } = useDeposit(chainId)
  const { notifyError, notifySuccess } = useGlobalContext()
  const { refetch: refetchStakedAmount } = useStakedBalance(chainId, address)
  const { getUserData } = useGetUserData()

  const { isSuccess: approveSuccess, data: approveStatusData } = useWaitForTransactionReceipt({
    hash: approveTx,
    chainId: chainId
  });
  const { isSuccess: depositSuccess, data: depositStatusData } = useWaitForTransactionReceipt({
    hash: depositTx,
    chainId: chainId
  });

  useEffect(() => {
    (async () => {
      if (isApproveTxError) {
        setDepositLoading(false)
        notifyError("Deposit error")
      } else if (approveTx) {
        if (approveStatusData) {
          if (approveSuccess) {
            try {
              deposit(depositAmount)
            } catch (error: any) {
              setDepositLoading(false)
              notifyError(error.response.data.message);
            }
          } else {
            setDepositLoading(false)
            notifyError("Deposit failed")
          }
        }
      }
    })()
  }, [approveTx, approveStatusData, approveSuccess, isApproveTxError])

  useEffect(() => {
    (async () => {
      try {
        if (isDepositTxError) {
          setDepositLoading(false);
          notifyError("Deposit failed");
        } else if (depositTx) {
          if (depositStatusData) {
            if (depositSuccess) {
              const { data } = await axios.post('/house/deposit-asset-token', {
                houseId: -1
              })
      
              if (data.status) {
                setDepositAmount(0)
                refetchStakedAmount()
                getUserData()
                setDepositLoading(false);
                notifySuccess(`${depositAmount} Asset Tokens deposited!`);
              } else {
                setDepositLoading(false);
                notifyError("Deposit failed");
              }
            } else {
              setDepositLoading(false);
              notifyError("Deposit failed");
            }
          }
        }
      } catch (error: any) {
      setDepositLoading(false)
      notifyError(error.response.data.message);
    }
    })()
  }, [depositTx, depositStatusData, depositSuccess, isDepositTxError])
  

  const stake = async (amount: BigNumberish) => {
    try {
      setDepositAmount(amount)
      approve(ASSET_STAKE_CONTRACT_ADDRESS[chainId], amount)
    } catch (error: any) {
      setDepositLoading(false)
      notifyError(error.response.data.message);
    }
  }

  return { stake }
}
