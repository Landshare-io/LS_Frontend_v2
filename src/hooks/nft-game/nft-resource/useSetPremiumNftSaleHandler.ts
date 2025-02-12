import { useState, useEffect } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import { Address } from "viem";
import axios from "../axios/nft-game-axios"
import useSetApprovalForAll from "../../contract/PremiumNftContract/useSetApprovalForAll";
import useIsApprovedForAll from "../../contract/PremiumNftContract/useIsApproveForAll";
import useApprove from "../../contract/PremiumNftContract/useApprove";
import useGetPremiumNfts from "../premium-nfts/useGetPremiumNfts";
import { useTheme } from "next-themes";
import { PREMIUM_NFT_CONTRACT_ADDRESS, TRANSACTION_CONFIRMATIONS_COUNT } from "../../../config/constants/environments";

export default function useSetPremiumNftSaleHandler(chainId: number, address: Address | undefined) {
  const { notifyError, notifySuccess, isAuthenticated } = useGlobalContext()
  const [isLoading, setIsLoading] = useState('')
  const [premiumNftAddress, setPremiumNftAddress] = useState<Address>("0x")
  const [premiumNftData, setPremiumNftData] = useState<any>({})
  const [premiumNftPrice, setPremiumNftPrice] = useState(0)
  const { data: isApprovedForAllOfPocelain } = useIsApprovedForAll(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Porcelain Tile"][chainId], address) as { data: boolean }
  const { data: isApprovedForAllOfPool } = useIsApprovedForAll(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Pool Table"][chainId], address) as { data: boolean }
  const { data: isApprovedForAllOfMarble } = useIsApprovedForAll(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Marble Countertops"][chainId], address) as { data: boolean }

  const isApprovedForAll: Record<string, boolean> = {
    "Porcelain Tile": isApprovedForAllOfPocelain,
    "Pool Table": isApprovedForAllOfPool,
    "Marble Countertops": isApprovedForAllOfMarble
  }
  const { setApprovalForAll, data: setApprovalForAllTx, isError: isSetApprovalForAllTxError } = useSetApprovalForAll()
  const { approve, data: approveTx, isError: isApproveTxError } = useApprove()
  const { getPremiumNfts } = useGetPremiumNfts(chainId, address)


  const { isSuccess: setApprovalForAllSuccess, data: setApprovalForAllStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: setApprovalForAllTx,
    chainId: chainId
  });
  const { isSuccess: approveSuccess, data: approveStatusData } = useWaitForTransactionReceipt({
    confirmations: TRANSACTION_CONFIRMATIONS_COUNT,
    hash: approveTx,
    chainId: chainId
  });


  useEffect(() => {
    if (isSetApprovalForAllTxError) {
      setIsLoading('')
      notifyError("Transaction Failed")
    } else if (setApprovalForAllTx) {
      if (setApprovalForAllStatusData) {
        if (setApprovalForAllSuccess) {
          approve(chainId, premiumNftAddress, premiumNftData.onChainId)
        } else {
          setIsLoading('')
          notifyError("Transaction Failed")
        }
      }
    }
  }, [setApprovalForAllTx, setApprovalForAllStatusData, setApprovalForAllSuccess, isSetApprovalForAllTxError])

  useEffect(() => {
    (async () => {
      if (isApproveTxError) {
        setIsLoading('')
        notifyError("Transaction Failed")
      } else if (approveTx) {
        if (approveStatusData) {
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
      }
    })()
  }, [approveTx, approveStatusData, approveSuccess, isApproveTxError])


  const setPremiumNftsOnSale = (contractName: string, item: any, price: number) => {
    if (!isAuthenticated) return notifyError("Please login")
      setIsLoading(`${item.id}-${item.onChainId}`)
    setPremiumNftData(item)
    setPremiumNftPrice(price)
    setPremiumNftAddress(PREMIUM_NFT_CONTRACT_ADDRESS[contractName][chainId])
    if (isApprovedForAll[contractName]) approve(chainId, PREMIUM_NFT_CONTRACT_ADDRESS[contractName][chainId], premiumNftData.onChainId)
    else setApprovalForAll(chainId, PREMIUM_NFT_CONTRACT_ADDRESS[contractName][chainId])
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
