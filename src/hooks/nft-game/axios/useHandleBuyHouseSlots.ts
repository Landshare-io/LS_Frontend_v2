import { useEffect, useState } from "react";
import { Address } from "viem"
import { useSendTransaction } from "wagmi";
import axios from "./nft-game-axios"
import useBalanceOfLand from "../../contract/LandTokenContract/useBalanceOf"
import { useGlobalContext } from "../../../context/GlobalContext";
import { PROVIDERS } from "../../../config/constants/environments";

export default function useHandleBuyHouseSlots(chainId: number, address: Address | undefined, setUserActivatedSlots: Function, setBuyHouseSlotLoading: Function) {
  const { notifyError, notifySuccess } = useGlobalContext()
  const { refetch: refetchBalance } = useBalanceOfLand({ chainId, address })
  const { sendTransaction, data: sendTransactionTx } = useSendTransaction()
  const [signNonce, setSignNonce] = useState(0)

  useEffect(() => {
    (async () => {
      if (sendTransactionTx) {
        try {
          const receipt = await PROVIDERS[chainId].getTransactionReceipt(sendTransactionTx);
  
          if (receipt.status) {
            const { data } = await axios.post('/has-item/buy-house-slot', {
              txHash: receipt.transactionHash,
              blockNumber: receipt.blockNumber,
              nonce: signNonce
            })
            refetchBalance()
            setUserActivatedSlots(data.activatedSlots)
            setBuyHouseSlotLoading(false)
            
            notifySuccess(`New house slot purchased successfully!`)
          } else {
            setBuyHouseSlotLoading(false)
            notifyError("Buy House Slot Error");
          }
        } catch (error: any) {
          console.log("Buy House Slot Error: ", error.response.data.message);
          setBuyHouseSlotLoading(false)
          notifyError(error.response.data.message);
        }
      }
      
      
    })()
  }, [sendTransactionTx])

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
