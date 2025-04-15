import { useEffect, useState } from "react";
import { Address } from "viem"
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import axios from "../axios/nft-game-axios"
import useBalanceOfLandToken from "../../contract/LandTokenContract/useBalanceOf"
import { useGlobalContext } from "../../../context/GlobalContext"
import useGetNftCredits from "../apollo/useGetNftCredits";
import { PROVIDERS, TRANSACTION_CONFIRMATIONS_COUNT } from "../../../config/constants/environments"

export default function useMintHouseNft(chainId: number, address: Address | undefined, setIsLoading: Function) {
  const [transactionNonce, setTransactionNonce] = useState(0)
  const [ableHarvestAmount, setAbleHarvestAmount] = useState(0)
  const [productType, setProductType] = useState(-1)
  const { setNftCredits, nftCredits } = useGetNftCredits(address)
  const { notifyError, notifySuccess } = useGlobalContext()
  const { data: balance, refetch: refetchBalance } = useBalanceOfLandToken({ chainId, address })
  const { sendTransaction, data: sendTransactionTx, isError: isSendTransactionError } = useSendTransaction()
  const { isSuccess: sendTxSuccess } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: sendTransactionTx,
    chainId: chainId
  });

  useEffect(() => {
    (async () => {
      if (isSendTransactionError) {
        setIsLoading(false);
        setTransactionNonce(0)
        setAbleHarvestAmount(0)
        setProductType(-1)
        return notifyError(`Mint a new house Error`);
      } else if (transactionNonce) {
        if (sendTransactionTx) {
          if (sendTxSuccess) {
            try {
              const { data } = await axios.post('/house/add-new-house', {
                assetAmount: ableHarvestAmount * 4,
                nonce: transactionNonce,
                houseType: (
                  productType == 1 ? (ableHarvestAmount >= 500 ? 2 : 1) :
                    productType == 2 ? (ableHarvestAmount >= 500 ? 4 : 3) : 
                      productType == 3 ? (ableHarvestAmount >= 500 ? 6 : 5) : (ableHarvestAmount >= 500 ? 8 : 7))
              })
  
              await refetchBalance()
              setTransactionNonce(0)
              setIsLoading(false);
              setAbleHarvestAmount(0)
              setProductType(-1)
              setNftCredits(nftCredits - ableHarvestAmount * 4)
              return notifySuccess(`Mint a new house successfully`)
            } catch (e) {
              setIsLoading(false);
              setTransactionNonce(0)
              setAbleHarvestAmount(0)
              setProductType(-1)
              return notifyError(`Mint a new house Error`);
            }
          }
        }
      }
    })()
  }, [transactionNonce, sendTransactionTx, sendTxSuccess, isSendTransactionError])

  const mint = async (nftCreditCost: number, harvestAmount: number, type: number) => {
    try {
      setIsLoading(true)
      setAbleHarvestAmount(harvestAmount)
      setProductType(type)
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
