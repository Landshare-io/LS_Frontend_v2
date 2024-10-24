import { useState, useEffect } from "react";
import axios from "./nft-game-axios";
import { useGlobalContext } from "../../../context/GlobalContext";

export default function useGetGameItems() {
  const { isAuthenticated } = useGlobalContext();
  const [yieldUpgradesList, setYieldUpgradesList] = useState<any[]>([]);
  const [productionUpgradesList, setProductionUpgradesList] = useState<any[]>([]);
  const [premiumUpgradesList, setPremiumUpgradesList] = useState<any[]>([]);
  const [boostItemsList, setBoostItemsList] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      getItems()
    }
  }, [isAuthenticated])
  
  const getItems = async () => {
    try {
      if (!isAuthenticated) return
      const { data: itemTypeData } = await axios.get('/item-type')

      for (const itemType of itemTypeData) {
        if (itemType.name == "Facility") continue

        const { data: fetchedItems } = await axios.get(`/item/${itemType.id}`);
        if (itemType.name == "Yield Upgrades") {
          setYieldUpgradesList(fetchedItems)
        }

        if (itemType.name == "Production Upgrades") {
          setProductionUpgradesList(fetchedItems)
        }

        if (itemType.name == "Premium Upgrades") {
          setPremiumUpgradesList(fetchedItems)
        }

        if (itemType.name == "Boost Items") {
          setBoostItemsList(fetchedItems)
        }
      }
    } catch (error: any) {
      console.log(error.response.data.message, error)
    }
  }

  return {
    yieldUpgradesList,
    productionUpgradesList,
    premiumUpgradesList,
    boostItemsList,
    getItems
  }
}
