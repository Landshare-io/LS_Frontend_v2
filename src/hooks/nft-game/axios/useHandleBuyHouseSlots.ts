import { useEffect, useState } from "react";
import { Address } from "viem"
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import axios from "./nft-game-axios"
import useBalanceOfLand from "../../contract/LandTokenContract/useBalanceOf"
import { useGlobalContext } from "../../../context/GlobalContext";
import { PROVIDERS, TRANSACTION_CONFIRMATIONS_COUNT } from "../../../config/constants/environments";

export default function useHandleBuyHouseSlots(chainId: number, address: Address | undefined, setUserActivatedSlots: Function, setBuyHouseSlotLoading: Function) {
  const { notifyError, notifySuccess } = useGlobalContext()
  const { refetch: refetchBalance } = useBalanceOfLand({ chainId, address })
  const { sendTransaction, data: sendTransactionTx, isError: isSendTransactionError } = useSendTransaction()
  const [signNonce, setSignNonce] = useState(0)

  const { isSuccess: sendTxSuccess } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: sendTransactionTx,
    chainId: chainId
  });

  useEffect(() => {
    (async () => {
      if (signNonce) {
        if (isSendTransactionError) {
          setSignNonce(0)
          setBuyHouseSlotLoading(false)
          notifyError("Buy House Slot Error");
        } else if (sendTransactionTx) {
          if (sendTxSuccess) {
            try {
              const { data } = await axios.post('/has-item/buy-house-slot', {
                nonce: signNonce
              })
              await refetchBalance()
              setUserActivatedSlots(data.activatedSlots)
              setBuyHouseSlotLoading(false)
              setSignNonce(0)
              notifySuccess(`New house slot purchased successfully!`)
            } catch (error: any) {
              console.log("Buy House Slot Error: ", error.response.data.message);
              setSignNonce(0)
              setBuyHouseSlotLoading(false)
              notifyError(error.response.data.message);
            }
          }
        }
      }
    })()
  }, [isSendTransactionError, signNonce, sendTransactionTx, sendTxSuccess])

  const handleBuyHouseSlots = async () => {
    try {
      const { data: transactionData } = await axios.post('/has-item/get-buy-house-slot-transaction', {})

      setSignNonce(transactionData.nonce)
      sendTransaction(transactionData.transaction)
    } catch (error: any) {
      console.log("Buy House Slot Error: ", error.response.data.message);
      setBuyHouseSlotLoading(false)
      notifyError(error.response.data.message);
    }
  }

  return {
    handleBuyHouseSlots
  }
}
