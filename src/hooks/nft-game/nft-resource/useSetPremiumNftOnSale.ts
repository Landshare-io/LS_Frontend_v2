import { useState, useEffect } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import { Address } from "viem";
import axios from "../axios/nft-game-axios"
import useSetApprovalForAll from "../../contract/PremiumNftContract/useSetApprovalForAll";
import useIsApprovedForAll from "../../contract/PremiumNftContract/useIsApproveForAll";
import useApprove from "../../contract/PremiumNftContract/useApprove";
import { useGlobalContext } from "../../../context/GlobalContext";

export default function useSetPremiumNftOnSale(chainId: number, address: Address | undefined) {
  const { notifyError, notifySuccess } = useGlobalContext()
  const [isLoading, setIsLoading] = useState(false)
  const [premiumNftAddress, setPremiumNftAddress] = useState<Address>("0x")
  const [premiumNftData, setPremiumNftData] = useState<any>({})
  const [premiumNftPrice, setPremiumNftPrice] = useState(0)
  const { isApprovedForAll, data: isApprovedForAllTx } = useIsApprovedForAll()
  const { setApprovalForAll, data: setApprovalForAllTx } = useSetApprovalForAll()
  const { approve, data: approveTx } = useApprove()

  const { isSuccess: isApprovedForAllSuccess, isLoading: isApprovedForAllLoading } = useWaitForTransactionReceipt({
    hash: isApprovedForAllTx,
    chainId: chainId
  });
  const { isSuccess: setApprovalForAllSuccess, isLoading: setApprovalForAllLoading } = useWaitForTransactionReceipt({
    hash: setApprovalForAllTx,
    chainId: chainId
  });
  const { isSuccess: approveSuccess, isLoading: approveLoading } = useWaitForTransactionReceipt({
    hash: approveTx,
    chainId: chainId
  });

  useEffect(() => {
    if (isApprovedForAllTx) {
      if (isApprovedForAllSuccess) {
        setApprovalForAll(chainId, premiumNftAddress)
      } else {
        setIsLoading(false)
        notifyError("Transaction Failed")
      }
    }
  }, [isApprovedForAllTx, isApprovedForAllSuccess])

  useEffect(() => {
    if (setApprovalForAllTx) {
      if (setApprovalForAllSuccess) {
        approve(chainId, premiumNftAddress, premiumNftData.onChainId)
      } else {
        setIsLoading(false)
        notifyError("Transaction Failed")
      }
    }
  }, [setApprovalForAllTx, setApprovalForAllSuccess])

  useEffect(() => {
    (async () => {
      if (approveTx) {
        if (approveSuccess) {
          try {
            const { data } = await axios.post('/premium-nft-marketplace', {
              type: premiumNftData.id,
              nftId: premiumNftData.onChainId,
              price: premiumNftPrice
            })

            setIsLoading(false)
            notifySuccess(`Set on-sale ${premiumNftData.name} #${premiumNftData.onChainId} successfully`)
          } catch (error: any) {
            console.log(error)
            setIsLoading(false)
            notifyError(error.response.data.message);
          }
        } else {
          setIsLoading(false)
          notifyError("Transaction Failed")
        }
      }
    })()
  }, [approveTx, approveSuccess])

  const setPremiumNftsOnSale = (contractAddress: Address, item: any, price: number) => {
    setIsLoading(true)
    setPremiumNftData(item)
    setPremiumNftPrice(price)
    setPremiumNftAddress(contractAddress)
    isApprovedForAll(chainId, contractAddress, address)
  }

  return {
    setPremiumNftsOnSale,
    isLoading
  }
}
