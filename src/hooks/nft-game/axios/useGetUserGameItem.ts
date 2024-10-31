import { useState, useEffect } from "react";
import { Address } from "viem";
import axios from "./nft-game-axios";
import useGetGameItems from "./useGetGameItems";
import useGetSetting from "./useGetSetting";
import useGetItemsByOwner from "../../contract/PremiumNftContract/useGetItemsByOwner";
import { 
  validatePremiumNftItem,
  validateDependency,
  validateItemDateWithDeadTime,
  validateItemDate
} from "../../../utils/helpers/validator";
import { productionUpdgradesData } from "../../../config/constants/game-data";
import { PREMIUM_NFT_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useGetUserGameItem(house: any, chainId: number, address: Address | undefined) {
  const [premiumNfts, setPremiumNfts] = useState<any[]>([]);
  const [yieldUpgrades, setYieldUpgrades] = useState<any[]>([])
  const [fortificationItems, setFortificationItems] = useState<any[]>([])
  const [hasConcreteFoundation, setHasConcreteFoundation] = useState(false)
  const [hasFireplace, setHasFireplace] = useState(false)
  const [hasHarvester, setHasHarvester] = useState(false)
  const [hasGenerator, setHasGenerator] = useState(false)
  const {
    yieldUpgradesList,
    premiumUpgradesList
  } = useGetGameItems()
  const { premiumAbleTime, oneDayTime } = useGetSetting()
  const porcelainItems = useGetItemsByOwner(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Porcelain Tile"][chainId], address)
  const poolTableItems = useGetItemsByOwner(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Pool Table"][chainId], address)
  const marbleItems = useGetItemsByOwner(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Marble Countertops"][chainId], address)

  const gettingItems = async () => {
    if (!house.premiumUpgrades) return;
    
    const contractItem: Record<string, any> = {
      "Porcelain Tile": porcelainItems,
      "Pool Table": poolTableItems,
      "Marble Countertops": marbleItems
    }
    const premiumUpgrades = []
    const tempYieldUpgrades = []
    for (let premiumUpgrade of house.premiumUpgrades) {
      const hasPremiumNftItem = validatePremiumNftItem(premiumUpgrade, premiumAbleTime)
      const { data: backendItems } = await axios.get(`/has-premium-nft/get-user-premium-nfts/${premiumUpgrade.id}`)
      const onChainItemsData = contractItem[premiumUpgrade.name]
  
      premiumUpgrades.push({
        ...premiumUpgrade,
        name: premiumUpgrade.name,
        multiplier: premiumUpgrade.buyReward[9],
        price: premiumUpgrade.buy[1],
        hasNft: hasPremiumNftItem,
        onChainItems: onChainItemsData.map((item: number) => item.toString()),
        backendItems
      })
    }
  
    for (const yieldUpgrade of yieldUpgradesList) {
      if (yieldUpgrade.name == 'Fireplace') {
        if (validateDependency(house, yieldUpgrade.id, oneDayTime) && (validateItemDateWithDeadTime(house.yieldUpgrades.filter((yItem: any) => yItem.id == yieldUpgrade.id)[0]) != -1)) {
          tempYieldUpgrades.push({
            ...yieldUpgrade,
            hasUpgrade: true
          })
        } else {
          tempYieldUpgrades.push({
            ...yieldUpgrade,
            hasUpgrade: false
          })
        }
      } else {
        if (
          validateDependency(house, yieldUpgrade.id, oneDayTime) &&
          validateItemDate(house.yieldUpgrades.filter((yItem: any) => yItem.id == yieldUpgrade.id)[0], oneDayTime)
        ) {
          tempYieldUpgrades.push({
            ...yieldUpgrade,
            hasUpgrade: true
          })
        } else {
          tempYieldUpgrades.push({
            ...yieldUpgrade,
            hasUpgrade: false
          })
        }
      }
    }
  
    const fireplace = house.productionUpgrades.filter((pItem: any) => pItem.name == "Firepit" && pItem.specialButtonName == "")[0].activeTime
    const concreteFoundation =
      validateItemDate(house.productionUpgrades.filter((pItem: any) => pItem.name == "Concrete Foundation" && pItem.specialButtonName == '')[0], oneDayTime) ||
      validateItemDate(house.productionUpgrades.filter((pItem: any) => pItem.name == "Concrete Foundation" && pItem.specialButtonName == 'REPAIR')[0], oneDayTime)
    const generator = house.productionUpgrades.filter((pItem: any) => pItem.name == "Generator")[0].activeTime
    const harvester = house.productionUpgrades.filter((pItem: any) => pItem.name == "Harvester")[0].activeTime
  
    const tempFortItems: any[] = []
    productionUpdgradesData.filter(item => item.sortingId === 4).map((fort: any) => {
      if (validateItemDate(house.productionUpgrades.filter((pItem: any) => pItem.name == fort.title)[0], oneDayTime)) {
        tempFortItems.push({
          ...fort,
          ...house.productionUpgrades.filter((pItem: any) => pItem.name == fort.title)[0],
          hasFort: true
        })
      } else {
        tempFortItems.push({
          ...fort,
          ...house.productionUpgrades.filter((pItem: any) => pItem.name == fort.title)[0],
          hasFort: false
        })
      }
    })
  
    setPremiumNfts(premiumUpgrades)
    setYieldUpgrades(tempYieldUpgrades)
    setHasConcreteFoundation(concreteFoundation)
    setHasFireplace(fireplace)
    setHasGenerator(generator)
    setHasHarvester(harvester)
    setFortificationItems(tempFortItems)
  }

  useEffect(() => {
    (async () => {
      await gettingItems()
    })()
  }, [house, premiumUpgradesList, porcelainItems, poolTableItems, marbleItems])

  return {
    premiumNfts,
    yieldUpgrades,
    fortificationItems,
    hasConcreteFoundation,
    hasFireplace,
    hasHarvester,
    hasGenerator
  }
}