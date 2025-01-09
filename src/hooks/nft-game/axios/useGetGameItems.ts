import { useState, useEffect } from "react";
import axios from "./nft-game-axios";
import { useGlobalContext } from "../../../context/GlobalContext";

let yieldUpgradesListState: any[] = []
let productionUpgradesListState: any[] = []
let premiumUpgradesListState: any[] = []
let boostItemsListState: any[] = []

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

export default function useGetGameItems() {
  const { isAuthenticated } = useGlobalContext();
  const [yieldUpgradesList, setYieldUpgradesList] = useState<any[]>(yieldUpgradesListState);
  const [productionUpgradesList, setProductionUpgradesList] = useState<any[]>(productionUpgradesListState);
  const [premiumUpgradesList, setPremiumUpgradesList] = useState<any[]>(premiumUpgradesListState);
  const [boostItemsList, setBoostItemsList] = useState<any[]>(boostItemsListState);

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setYieldUpgradesList(yieldUpgradesListState);
      setProductionUpgradesList(productionUpgradesListState)
      setPremiumUpgradesList(premiumUpgradesListState)
      setBoostItemsList(boostItemsListState)
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updateYieldUpgrades = (newYieldUpgrades: any[]) => {
    yieldUpgradesListState = newYieldUpgrades;
    notifySubscribers();
  };

  const updateProductionUpgrades = (newProductionUpgrades: any[]) => {
    productionUpgradesListState = newProductionUpgrades;
    notifySubscribers();
  };

  const updatePremiumUpgrades = (newPremiumUpgrades: any[]) => {
    premiumUpgradesListState = newPremiumUpgrades;
    notifySubscribers();
  };

  const updateBoostItems = (newBoostItems: any[]) => {
    boostItemsListState = newBoostItems;
    notifySubscribers();
  };

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
          updateYieldUpgrades(fetchedItems)
        }

        if (itemType.name == "Production Upgrades") {
          updateProductionUpgrades(fetchedItems)
        }

        if (itemType.name == "Premium Upgrades") {
          updatePremiumUpgrades(fetchedItems)
        }

        if (itemType.name == "Boost Items") {
          updateBoostItems(fetchedItems)
        }
      }
    } catch (error: any) {
      // console.log(error.response.data.message, error)
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
