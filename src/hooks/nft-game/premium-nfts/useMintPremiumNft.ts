import { useEffect, useState } from "react";
import { Address } from "viem"
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import axios from "../axios/nft-game-axios"
import useBalanceOf from "../../contract/LandTokenContract/useBalanceOf"
import useTotalSupply from "../../contract/PremiumNftContract/useTotalSupply"
import { useGlobalContext } from "../../../context/GlobalContext"
import { PREMIUM_NFT_CONTRACT_ADDRESS, PROVIDERS } from "../../../config/constants/environments"

export default function useMintPremiumNft(chainId: number, address: Address | undefined, setLoader: Function) {
  const [premiumItem, setPremiumItem] = useState<any>({})
  const [transactionNonce, setTransactionNonce] = useState(0)
  const { notifyError, notifySuccess } = useGlobalContext()
  const { sendTransaction, data: sendTransactionTx, isError: isSendTransactionError } = useSendTransaction()
  const { isSuccess: sendTxSuccess, data: sendTxData } = useWaitForTransactionReceipt({
    hash: sendTransactionTx,
    chainId: chainId
  });
  const { refetch: refetchBalance } = useBalanceOf({ chainId, address }) as { refetch: Function }
  const { refetch: prRefetch } = useTotalSupply(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Porcelain Tile"][chainId]) as { refetch: Function }
  const { refetch: ptRefetch } = useTotalSupply(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Pool Table"][chainId]) as { refetch: Function }
  const { refetch: mcRefetch } = useTotalSupply(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Marble Countertops"][chainId]) as { refetch: Function }

  useEffect(() => {
    (async () => {
      if (transactionNonce) {
        if (isSendTransactionError) {
          setLoader("");
          setTransactionNonce(0)
          notifyError(`Mint ${premiumItem.name} Error`);
        }
        if (sendTransactionTx) {
          if (sendTxData) {
            if (sendTxSuccess) {
              const receipt = await PROVIDERS[chainId].getTransactionReceipt(sendTransactionTx);
      
              if (receipt.status) {
    
                const { data } = await axios.post('/has-item/mint-premium-nft', {
                  itemId: premiumItem.id,
                  txHash: receipt.transactionHash,
                  blockNumber: receipt.blockNumber,
                  nonce: premiumItem.nonce
                })
    
                if (data) {
                  await refetchBalance()
                  await prRefetch()
                  await ptRefetch()
                  await mcRefetch()
                  setTransactionNonce(0)
                  setLoader("");
                  notifySuccess(`Mint ${premiumItem.name} successfully`)
                } else {
                  setLoader("");
                  setTransactionNonce(0)
                  notifyError(`Mint ${premiumItem.name} Error`);
                }
              } else {
                setLoader("");
                setTransactionNonce(0)
                notifyError(`Mint ${premiumItem.name} Error`);
              }
            } else {
              setLoader("");
              setTransactionNonce(0)
              notifyError(`Mint ${premiumItem.name} Error`);
            }
          }
        }
      }
    })()
  }, [transactionNonce, sendTransactionTx, sendTxData, sendTxSuccess, isSendTransactionError])

  const mint = async (item: any) => {
    setPremiumItem(item)
    const { data: transactionData } = await axios.post('/has-item/get-item-transaction', {
      itemId: item.id
    })
    setTransactionNonce(transactionData.nonce)
    sendTransaction(transactionData.transaction)
  }

  return {
    mint
  }
}