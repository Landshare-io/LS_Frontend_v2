import { useState, useEffect } from "react"
import { Address } from "viem"
import axios from "../axios/nft-game-axios"
import useGetGameItems from "../axios/useGetGameItems"
import useGetItemsByOwner from "../../contract/PremiumNftContract/useGetItemsByOwner"
import { PREMIUM_NFT_CONTRACT_ADDRESS } from "../../../config/constants/environments"
import {
  getHasPremiumNftIds,
  getPremiumNftAbleItems
} from "../../../utils/helpers/validator";
import useGetSetting from "../axios/useGetSetting"
import { useGlobalContext } from "../../../context/GlobalContext"

export default function useGetPremiumNfts(chainId: number, address: Address | undefined) {
  const { isAuthenticated } = useGlobalContext()
  const [premiumNfts, setPremiumNfts] = useState<any[]>([])
  const { premiumUpgradesList } = useGetGameItems()
  const { premiumAbleTime } = useGetSetting()
  const porcelainItems = useGetItemsByOwner(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Porcelain Tile"][chainId], address)
  const poolTableItems = useGetItemsByOwner(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Pool Table"][chainId], address)
  const marbleItems = useGetItemsByOwner(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Marble Countertops"][chainId], address)

  const getPremiumNfts = async () => {
    if (!isAuthenticated) return
    const premiumUpgrades = []
    const contractItem: Record<string, any> = {
      "Porcelain Tile": porcelainItems,
      "Pool Table": poolTableItems,
      "Marble Countertops": marbleItems
    }
    for (let premiumUpgrade of premiumUpgradesList) {
      const { data: backendItems } = await axios.get(`/has-premium-nft/get-user-premium-nfts/${premiumUpgrade.id}`)
      const { data: marketplaceItems } = await axios.get(`/premium-nft-marketplace/${premiumUpgrade.id}`)
      const onChainItemsData = await contractItem[premiumUpgrade.name]

      const hasNftIds = getHasPremiumNftIds(backendItems, premiumAbleTime)
      const ableNftIds = getPremiumNftAbleItems(onChainItemsData, hasNftIds)

      for (let i = 0; i < ableNftIds.length; i++) {
        premiumUpgrades.push({
          ...premiumUpgrade,
          name: premiumUpgrade.name,
          multiplier: premiumUpgrade.buyReward[9],
          price: premiumUpgrade.buy[1],
          onChainId: ableNftIds[i].toString(),
          marketplaceItem:
            marketplaceItems.filter((item: any) => item.type == premiumUpgrade.id && item.nftId == ableNftIds[i].toString()).length > 0 ?
              marketplaceItems.filter((item: any) => item.type == premiumUpgrade.id && item.nftId == ableNftIds[i].toString())[0].id :
              -1
        })
      }
    }
    setPremiumNfts(premiumUpgrades)
  }

  return {
    premiumNfts,
    getPremiumNfts
  }
}
