import { useState, useEffect } from "react";
import numeral from "numeral";
import { useSendTransaction } from "wagmi";
import axios from "../axios/nft-game-axios";
import { useGlobalContext } from "../../../context/GlobalContext";
import useGetResource from "../axios/useGetResource";
import { PROVIDERS } from "../../../config/constants/environments";

export default function useBuyPowerWithLandToken(chainId: number, refetchBalance: Function, setIsLoading: Function) {
  const { notifySuccess, notifyError, isAuthenticated } = useGlobalContext()
  const { sendTransaction, data: sendTransactionTx } = useSendTransaction()
  const { setResource } = useGetResource()
  const [powerAmount, setPowerAmount] = useState('0')
  const [landAmount, setLandAmount] = useState(0)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    (async () => {
      if (sendTransactionTx) {
        const receipt = await PROVIDERS[chainId].getTransactionReceipt(sendTransactionTx);

        if (receipt.status) {
          const { data } = await axios.post('/has-item/buy-power-with-land', {
            txHash: receipt.transactionHash,
            blockNumber: receipt.blockNumber,
            requiredLandToken: landAmount,
            nonce: nonce
          })
  
          await refetchBalance()
          setResource([data.resource.power, data.resource.lumber, data.resource.brick, data.resource.concrete, data.resource.steel])
          setIsLoading([false, false]);
          notifySuccess(`Bought ${powerAmount} Power successfully!`)
        } else {
          setIsLoading([false, false]);
          notifyError("Buy Power Error");
        }
      }
      
      
    })()
  }, [sendTransactionTx])

  const buyPowerWithLandtoken = async (powerToBuy: string, powerPerLandtoken: number) => {
    try {
      if (!isAuthenticated) return
      setPowerAmount(powerToBuy)
      const requiredLandToken = numeral(Number(powerToBuy) / powerPerLandtoken).format('0.[00]')
      setLandAmount(Number(requiredLandToken))
      const { data: transactionData } = await axios.post('/has-item/get-buy-power-transaction', {
        requiredLandToken: requiredLandToken
      })
      setNonce(transactionData.nonce)
      sendTransaction(transactionData.transaction)
    } catch (error: any) {
      console.log("Buy Power Error: ", error);
      setIsLoading([false, false]);
      notifyError(error.response.data.message);
    }
  };

  return {
    buyPowerWithLandtoken
  }
}