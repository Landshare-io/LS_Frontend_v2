import { useState, useEffect } from "react"
import { useWaitForTransactionReceipt } from "wagmi";
import { BigNumberish } from "ethers"
import { bsc } from "viem/chains";
import useApprove from "../AssetTokenContract/useApprove"
import useApproveOfMd from "../AssetMDTokenContract/useApprove"
import { useGlobalContext } from "../../../context/GlobalContext";
import { SWAPCAT_ADDRESS, TRANSACTION_CONFIRMATIONS_COUNT } from "../../../config/constants/environments"

export default function useApproveOffer(buyOffer: Function, setIsSwapping: Function) {
  const [offeringId, setOfferingId] = useState<string>('');
  const { approve, data: approveTx, isError: isApproveError } = useApprove()
  const { approve: approveMd, data: approveMdTx, isError: isApproveMdError } = useApproveOfMd()
  const { notifyError } = useGlobalContext()

  const { isSuccess: approveSuccess, data: approveStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: approveTx,
    chainId: bsc.id
  });
  const { isSuccess: approveMdSuccess, data: approveMdStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: approveMdTx,
    chainId: bsc.id
  });

  useEffect(() => {
    (async () => {
      if (isApproveError) {
        notifyError("Approve Error");
        setIsSwapping([false, false]);
      } else if (approveTx) {
        if (approveStatusData) {
          if (approveSuccess) {
            buyOffer(offeringId);
          } else {
            notifyError("Approve Error");
            setIsSwapping([false, false]);
          }
        }
      }
    })()
  }, [isApproveError, approveTx, approveStatusData, approveSuccess])

  useEffect(() => {
    (async () => {
      if (isApproveMdError) {
        notifyError("Approve Error");
        setIsSwapping([false, false]);
      } else if (approveMdTx) {
        if (approveMdStatusData) {
          if (approveMdSuccess) {
            buyOffer(offeringId);
          } else {
            notifyError("Approve Error");
            setIsSwapping([false, false]);
          }
        }
      }
    })()
  }, [isApproveMdError, approveMdTx, approveMdStatusData, approveMdSuccess])

  const approveAsset = (offerID: string, tokenType: string, amount: BigNumberish | number) => {
    try {
      setOfferingId(offerID)
      if (tokenType == 'LSNF') {
        approve(SWAPCAT_ADDRESS, amount)
      } else approveMd(SWAPCAT_ADDRESS, amount)
    } catch (error) {
      console.log(error)
      notifyError("Approve Error");
    }
  }

  return { approveAsset }
}