import { useEffect, useState } from "react";
import { Address } from "viem"
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import axios from "../axios/nft-game-axios"
import useBalanceOfLandToken from "../../contract/LandTokenContract/useBalanceOf"
import { useGlobalContext } from "../../../context/GlobalContext"
import { PROVIDERS } from "../../../config/constants/environments"

export default function useMintHouseNft(chainId: number, address: Address | undefined, setIsLoading: Function) {
  const [transactionNonce, setTransactionNonce] = useState(0)
  const { notifyError, notifySuccess } = useGlobalContext()
  const { data: balance, refetch: refetchBalance } = useBalanceOfLandToken({ chainId, address })
  const { sendTransaction, data: sendTransactionTx, isError: isSendTransactionError } = useSendTransaction()
  const { isSuccess: sendTxSuccess, data: sendTxData } = useWaitForTransactionReceipt({
    hash: sendTransactionTx,
    chainId: chainId
  });

  useEffect(() => {
    (async () => {
      if (isSendTransactionError) {
        setIsLoading(false);
        setTransactionNonce(0)
        return notifyError(`Mint a new house Error`);
      } else if (transactionNonce) {
        if (sendTransactionTx) {
          if (sendTxData) {
            if (sendTxSuccess) {
              const receipt = await PROVIDERS[chainId].getTransactionReceipt(sendTransactionTx);
      
              if (receipt.status) {
                await refetchBalance()
                setTransactionNonce(0)
                setIsLoading(false);
                return notifySuccess(`Mint a new house successfully`)
              } else {
                setIsLoading(false);
                setTransactionNonce(0)
                return notifyError(`Mint a new house Error`);
              }
            } else {
              setIsLoading(false);
              setTransactionNonce(0)
              return notifyError(`Mint a new house Error`);
            }
          }
        }
      }
    })()
  }, [transactionNonce, sendTransactionTx, sendTxData, sendTxSuccess, isSendTransactionError])

  const mint = async (nftCreditCost: number, harvestAmount: number) => {
    try {
      setIsLoading(true)
      const { data: transactionData } = await axios.post('/house/get-transaction-for-house-mint', {
        assetAmount: nftCreditCost
      })
  
      const feeLandAmount = harvestAmount / 100 * 8;
  
      if (Number(balance) >= Number(feeLandAmount)) {
        setTransactionNonce(transactionData.nonce)
        sendTransaction(transactionData.transaction)
      } else {
        setIsLoading(false)
        return notifyError(`Insufficient LAND Token amount`);
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      return notifyError(`Mint a new house Error`);
    }
  }

  return {
    mint
  }
}
