import { useState, useEffect } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import { Address } from "viem";
import axios from "../axios/nft-game-axios"
import useSetApprovalForAll from "../../contract/PremiumNftContract/useSetApprovalForAll";
import useIsApprovedForAll from "../../contract/PremiumNftContract/useIsApproveForAll";
import useApprove from "../../contract/PremiumNftContract/useApprove";
import useGetPremiumNfts from "../premium-nfts/useGetPremiumNfts";
import { useGlobalContext } from "../../../context/GlobalContext";

export default function useSetPremiumNftSaleHandler(chainId: number, address: Address | undefined) {
  const { notifyError, notifySuccess, isAuthenticated } = useGlobalContext()
  const [isLoading, setIsLoading] = useState('')
  const [premiumNftAddress, setPremiumNftAddress] = useState<Address>("0x")
  const [premiumNftData, setPremiumNftData] = useState<any>({})
  const [premiumNftPrice, setPremiumNftPrice] = useState(0)
  const { isApprovedForAll, data: isApprovedForAllTx } = useIsApprovedForAll()
  const { setApprovalForAll, data: setApprovalForAllTx } = useSetApprovalForAll()
  const { approve, data: approveTx } = useApprove()
  const { getPremiumNfts } = useGetPremiumNfts(chainId, address)

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
        setIsLoading('')
        notifyError("Transaction Failed")
      }
    }
  }, [isApprovedForAllTx, isApprovedForAllSuccess])

  useEffect(() => {
    if (setApprovalForAllTx) {
      if (setApprovalForAllSuccess) {
        approve(chainId, premiumNftAddress, premiumNftData.onChainId)
      } else {
        setIsLoading('')
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

            setIsLoading('')
            notifySuccess(`Set on-sale ${premiumNftData.name} #${premiumNftData.onChainId} successfully`)
          } catch (error: any) {
            console.log(error)
            setIsLoading('')
            notifyError(error.response.data.message);
          }
        } else {
          setIsLoading('')
          notifyError("Transaction Failed")
        }
      }
    })()
  }, [approveTx, approveSuccess])

  const setPremiumNftsOnSale = (contractAddress: Address, item: any, price: number) => {
    if (!isAuthenticated) return notifyError("Please login")
    setIsLoading(`${item.id}-${item.onChainId}`)
    setPremiumNftData(item)
    setPremiumNftPrice(price)
    setPremiumNftAddress(contractAddress)
    isApprovedForAll(chainId, contractAddress, address)
  }

  const setPremiumNftsOffSale = async (item: any) => {
    try {
      setIsLoading(`${item.id}-${item.onChainId}`)
      const { data } = await axios.delete(`/premium-nft-marketplace?type=${item.id}&nftId=${item.onChainId}`)

      await getPremiumNfts()
      notifySuccess(`Set off-sale ${item.name} #${item.onChainId} successfully`)
      setIsLoading('')
    } catch (error: any) {
      setIsLoading('');
      return notifyError(error.response.data.message);
    }
  }

  return {
    setPremiumNftsOffSale,
    setPremiumNftsOnSale,
    isLoading
  }
}
