import { useState, useEffect } from "react";
import { Address, parseEther } from "viem";
import { useWaitForTransactionReceipt, useSendTransaction } from "wagmi";
import axios from "./nft-game-axios";
import { useGlobalContext } from "../../../context/GlobalContext";
import useApprove from "../../contract/LandTokenContract/useApprove";
import useBalanceOf from "../../contract/LandTokenContract/useBalanceOf";
import { ADMIN_WALLET_ADDRESS, PROVIDERS, TRANSACTION_CONFIRMATIONS_COUNT } from "../../../config/constants/environments";

export default function useBuyHouse(chainId: number, product: any, address: Address | undefined, setIsLoading: Function, getProducts: Function) {
  const [signNonce, setSignNonce] = useState(0)
  const { notifyError, notifySuccess } = useGlobalContext()
  const { approve, data: approveTx, isError: isApproveError } = useApprove()
  const { data: balance, refetch } = useBalanceOf({ chainId, address })
  
  const { sendTransaction, data: sendTransactionTx, isError: isSendTransactionError } = useSendTransaction()

  const { isSuccess: sendTxSuccess } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: sendTransactionTx,
    chainId: chainId
  });
  const { isSuccess: approveSuccess, data: approveStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: approveTx,
    chainId: chainId
  });

  useEffect(() => {
    (async () => {
      if (isApproveError) {
        notifyError(`Approve Error`)
      } else if (approveTx) {
        if (approveStatusData) {
          if (approveSuccess) {
            try {
              const { data: transactionData } = await axios.post('/house/get-transaction-for-house-sale', {
                houseId: product.id,
              })

              setSignNonce(transactionData.nonce)
              sendTransaction(transactionData.transaction)
            } catch (error: any) {
              notifyError(error.response.data.message);
            }
          } else {
            notifyError(`Approve Error`)
          }
        }
      }
    })()
  }, [isApproveError, approveTx, approveStatusData, approveSuccess])

  useEffect(() => {
    (async () => {
      if (signNonce) {
        if (isSendTransactionError) {
          setIsLoading(false);
          setSignNonce(0)
          notifyError(`Buy House Error`);
        } else if (sendTransactionTx) {
          if (sendTxSuccess) {
            try {
              const {data} = await axios.post('/house/buy-house-with-land', {
                houseId: product.id,
                nonce: signNonce
              })
              await refetch()
              await getProducts({ searchType: "all" });
              setIsLoading(false);
              setSignNonce(0)
              notifySuccess("Buy House Success")
            } catch (error: any) {
              console.log(error)
              setIsLoading(false);
              setSignNonce(0)
              notifyError(error.response.data.message)
            }
          } else {
            setIsLoading(false);
            setSignNonce(0)
            notifyError(`Buy House Error`);
          }
        }
      }
    })()
  }, [isSendTransactionError, signNonce, sendTransactionTx, sendTxSuccess])

  const buyProduct = () => {
    if (Number(balance) >= product.salePrice) {
      setIsLoading(true);
      approve(chainId, ADMIN_WALLET_ADDRESS[chainId], parseEther(product.salePrice.toString()))
    } else {
      notifyError("Not Enough LAND Token !");
    }
  }

  return { buyProduct }
}