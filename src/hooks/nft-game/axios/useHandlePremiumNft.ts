import { useState, useEffect } from "react"
import { useChainId } from "wagmi"
import { Address } from "viem"
import axios from "./nft-game-axios"
import useGetHouse from "./useGetHouse"
import useGetSetting from "./useGetSetting"
import useGetGameItems from "./useGetGameItems"
import useGetItemsByOwner from "../../contract/PremiumNftContract/useGetItemsByOwner"
import { useGlobalContext } from "../../../context/GlobalContext"
import { getDependencyItemInstances, validatePremiumNftItem } from "../../../utils/helpers/validator"
import { PREMIUM_NFT_CONTRACT_ADDRESS } from "../../../config/constants/environments"
import marble from "../../../../public/img/marketplace-property/marble.png";
import pool from "../../../../public/img/marketplace-property/pool.png";
import windfarm from "../../../../public/img/marketplace-property/tile.png";

export default function useHandlePremiumNft(house: any, setLoader: Function, address: Address | undefined) {
  const chainId = useChainId()
  const { notifyError, notifySuccess } = useGlobalContext()
  const { oneDayTime, premiumAbleTime } = useGetSetting()
  const [premiumNfts, setPremiumNfts] = useState<any[]>([]);
  const { getHouse } = useGetHouse(house.id)
  const {
    yieldUpgradesList,
    productionUpgradesList,
    boostItemsList,
    premiumUpgradesList
  } = useGetGameItems()
  const images: Record<string, any> = {
    "Porcelain Tile": windfarm,
    "Pool Table": pool,
    "Marble Countertops": marble
  }

  const porcelainItems = useGetItemsByOwner(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Porcelain Tile"][chainId], address)
  const poolTableItems = useGetItemsByOwner(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Pool Table"][chainId], address)
  const marbleItems = useGetItemsByOwner(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Marble Countertops"][chainId], address)
  const contractItem: Record<string, any> = {
    "Porcelain Tile": porcelainItems,
    "Pool Table": poolTableItems,
    "Marble Countertops": marbleItems
  }

  useEffect(() => {
    if (typeof address == 'undefined') return
    gettingPremiumItems()
  }, [address])

  const gettingPremiumItems = async () => {
    if (!house.premiumUpgrades) return;

    const premiumUpgrades = []
    for (let premiumUpgrade of house.premiumUpgrades) {
      const depencencies = getDependencyItemInstances([
        ...yieldUpgradesList,
        ...productionUpgradesList,
        ...boostItemsList,
        ...premiumUpgradesList,
      ], premiumUpgrade.id)
      const hasPremiumNftItem = validatePremiumNftItem(premiumUpgrade, premiumAbleTime)
      const { data: backendItems } = await axios.get(`/has-premium-nft/get-user-premium-nfts/${premiumUpgrade.id}`)
      const onChainItemsData = contractItem[premiumUpgrade.name]

      premiumUpgrades.push({
        ...premiumUpgrade,
        name: premiumUpgrade.name,
        multiplier: premiumUpgrade.buyReward[9],
        imgSrc: images[premiumUpgrade.name],
        infoText:
          `${premiumUpgrade?.name ?? ''} NFT increases the house multiplier by +${premiumUpgrade.buyReward[9]}, requires ${depencencies[0]?.name}`,
        price: premiumUpgrade.buy[1],
        hasNft: hasPremiumNftItem,
        onChainItems: onChainItemsData.map((item: number) => item.toString()),
        backendItems
      })
    }

    setPremiumNfts(premiumUpgrades)
  }

  const detachPremiumNftHandler = async (item: any) => {
    try {
      setLoader(item.name)
      const { data } = await axios.post('/has-premium-nft/detach-premium-nft-house', {
        itemId: item.id,
        houseId: house.id
      })

      await getHouse()
      gettingPremiumItems();
      setLoader('')
      notifySuccess(`Detached ${item.name} successfully`);
    } catch (error: any) {
      setLoader('')
      console.log("Approve Error", error);
      notifyError(error.response.data.message);
    }
  }

  return {
    premiumNfts,
    detachPremiumNftHandler
  }
}