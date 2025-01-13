import { useState, useEffect } from "react";
import numeral from "numeral";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import axios from "../axios/nft-game-axios";
import { useGlobalContext } from "../../../context/GlobalContext";
import useGetResource from "../axios/useGetResource";
import { PROVIDERS } from "../../../config/constants/environments";

export default function useBuyPowerWithLandToken(chainId: number, refetchBalance: Function, setIsLoading: Function) {
  const { notifySuccess, notifyError, isAuthenticated } = useGlobalContext()
  const { sendTransaction, data: sendTransactionTx, isError: isSendTransactionError } = useSendTransaction()
  const { isSuccess: sendTxSuccess, data: sendTxData } = useWaitForTransactionReceipt({
    hash: sendTransactionTx,
    chainId: chainId
  });
  const { setResource } = useGetResource()
  const [powerAmount, setPowerAmount] = useState('0')
  const [landAmount, setLandAmount] = useState(0)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    (async () => {
      if (nonce) {
        if (isSendTransactionError) {
          setIsLoading([false, false]);
          setNonce(0)
          notifyError("Buy Power Error");
        } else if (sendTransactionTx) {
          if (sendTxData) {
            if (sendTxSuccess) {
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
                setNonce(0)
                notifySuccess(`Bought ${powerAmount} Power successfully!`)
              } else {
                setIsLoading([false, false]);
                setNonce(0)
                notifyError("Buy Power Error");
              }
            } else {
              setIsLoading([false, false]);
              setNonce(0)
              notifyError("Buy Power Error");
            }
          }
        }
      }
    })()
  }, [nonce, sendTransactionTx, sendTxData, sendTxSuccess, isSendTransactionError])

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