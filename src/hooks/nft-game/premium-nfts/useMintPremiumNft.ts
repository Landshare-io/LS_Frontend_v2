import { useEffect, useState } from "react";
import { Address } from "viem"
import { useSendTransaction } from "wagmi";
import axios from "../axios/nft-game-axios"
import useBalanceOf from "../../contract/LandTokenContract/useBalanceOf"
import useTotalSupply from "../../contract/PremiumNftContract/useTotalSupply"
import { useGlobalContext } from "../../../context/GlobalContext"
import { PREMIUM_NFT_CONTRACT_ADDRESS, PROVIDERS } from "../../../config/constants/environments"

export default function useMintPremiumNft(chainId: number, address: Address | undefined, setLoader: Function) {
  const [premiumItem, setPremiumItem] = useState<any>({})
  const { notifyError, notifySuccess } = useGlobalContext()
  const { sendTransaction, data: sendTransactionTx } = useSendTransaction()
  const { refetch: refetchBalance } = useBalanceOf({ chainId, address }) as { refetch: Function }
  const { refetch: prRefetch } = useTotalSupply(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Porcelain Tile"][chainId]) as { refetch: Function }
  const { refetch: ptRefetch } = useTotalSupply(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Pool Table"][chainId]) as { refetch: Function }
  const { refetch: mcRefetch } = useTotalSupply(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Marble Countertops"][chainId]) as { refetch: Function }

  useEffect(() => {
    (async () => {
      if (sendTransactionTx) {
        const receipt = await PROVIDERS[chainId].getTransactionReceipt(sendTransactionTx);

        if (receipt.status) {
          await refetchBalance()
          await prRefetch()
          await ptRefetch()
          await mcRefetch()

          setLoader("");
          notifySuccess(`Mint ${premiumItem.name} successfully`)
        } else {
          setLoader("");
        notifyError(`Mint ${premiumItem.name} Error`);
        }
      }
      
      
    })()
  }, [sendTransactionTx])

  const mint = async (item: any) => {
    setPremiumItem(item)
    const { data: transactionData } = await axios.post('/has-item/get-item-transaction', {
      itemId: item.id
    })

    sendTransaction(transactionData.transaction)
  }

  return {
    mint
  }
}