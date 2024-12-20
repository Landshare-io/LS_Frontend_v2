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
import { productionUpgradesData } from "../../../config/constants/game-data";
import { PREMIUM_NFT_CONTRACT_ADDRESS } from "../../../config/constants/environments";

let premiumNftsState: any[] = []
let yieldUpgradesState: any[] = []
let fortificationItemsState: any[] = []
let hasConcreteFoundationState = false
let hasFireplaceState = false
let hasHarvesterState = false
let hasGeneratorState = false

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

export default function useGetUserGameItem(house: any, chainId: number, address: Address | undefined) {
  const [premiumNfts, setPremiumNfts] = useState<any[]>(premiumNftsState);
  const [yieldUpgrades, setYieldUpgrades] = useState<any[]>(yieldUpgradesState)
  const [fortificationItems, setFortificationItems] = useState<any[]>(fortificationItemsState)
  const [hasConcreteFoundation, setHasConcreteFoundation] = useState(hasConcreteFoundationState)
  const [hasFireplace, setHasFireplace] = useState(hasFireplaceState)
  const [hasHarvester, setHasHarvester] = useState(hasHarvesterState)
  const [hasGenerator, setHasGenerator] = useState(hasGeneratorState)
  const {
    yieldUpgradesList,
    premiumUpgradesList
  } = useGetGameItems()
  const { premiumAbleTime, oneDayTime } = useGetSetting()
  const porcelainItems = useGetItemsByOwner(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Porcelain Tile"][chainId], address)
  const poolTableItems = useGetItemsByOwner(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Pool Table"][chainId], address)
  const marbleItems = useGetItemsByOwner(chainId, PREMIUM_NFT_CONTRACT_ADDRESS["Marble Countertops"][chainId], address)

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setPremiumNfts(premiumNftsState)
      setYieldUpgrades(yieldUpgradesState)
      setFortificationItems(fortificationItemsState)
      setHasConcreteFoundation(hasConcreteFoundationState)
      setHasFireplace(hasFireplaceState)
      setHasHarvester(hasHarvesterState)
      setHasGenerator(hasGeneratorState)
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updatePremiumNfts = (newPremiumNfts: any[]) => {
    premiumNftsState = newPremiumNfts;
    notifySubscribers();
  };

  const updateYieldUpgrades = (newYieldUpgrades: any[]) => {
    yieldUpgradesState = newYieldUpgrades;
    notifySubscribers();
  };

  const updateFortificationItems = (newFortificationItems: any[]) => {
    fortificationItemsState = newFortificationItems;
    notifySubscribers();
  };

  const updateHasConcreteFoundation = (newHasConcreteFoundation: boolean) => {
    hasConcreteFoundationState = newHasConcreteFoundation;
    notifySubscribers();
  };

  const updateHasFireplace = (newHasFireplace: boolean) => {
    hasFireplaceState = newHasFireplace;
    notifySubscribers();
  };

  const updateHasHarvester = (newHasHarvester: boolean) => {
    hasHarvesterState = newHasHarvester;
    notifySubscribers();
  };

  const updateHasGenerator = (newHasGenerator: boolean) => {
    hasGeneratorState = newHasGenerator;
    notifySubscribers();
  };

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
    productionUpgradesData.filter(item => item.sortingId === 4).map((fort: any) => {
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
  
    updatePremiumNfts(premiumUpgrades)
    updateYieldUpgrades(tempYieldUpgrades)
    updateHasConcreteFoundation(concreteFoundation)
    updateHasFireplace(fireplace)
    updateHasGenerator(generator)
    updateHasHarvester(harvester)
    updateFortificationItems(tempFortItems)
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