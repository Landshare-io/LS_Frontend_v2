import { useState, useEffect } from "react";
import axios from "./nft-game-axios";
import { useTheme } from "next-themes";

let houseState = {
  type: "",
  id: "",
  houseId: "",
  userId: "",
  name: "",
  series: "",
  depositedBalance: "0",
  multiplier: "0",
  currentDurability: "0",
  maxDurability: "0",
  isRare: false,
  tokenReward: "0",
  extendedBalance: "0",
  hasAddon: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  hasToolshed: [false, false, false, false, false],
  activeToolshedType: "0",
  hasFireplace: false,
  hasConcreteFoundation: false,
  gardenFertilize: false,
  hasHarvester: false,
  lastFortTime: ["0", "0", "0"],
  lastHandymanHiredTime: "0",
  activated: false,
  expireGardenTime: ["0"],
  porcelainTileMultiplier: 110,
  hasPorcelainTileNFT: false,
  hasPoolTableNFT: false,
  hasMarbleCounteropsNFT: false,
  totalHarvestedToken: "0",
  tokenHarvestLimit: "0",
  onSale: false,
  salePrice: 0,
  repairCost: [0, 0, 0, 0, 0],
  yieldUpgrades: [],
  productionUpgrades: [],
  premiumUpgrades: [],
  lastRepairTime: null,
  lastDurability: 0,
  deadTime: null,
  isActivated: false,
}

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

export default function useGetHouse(houseId: number | string) {
  const { isAuthenticated } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true)
  const [house, setHouse] = useState(houseState);

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setHouse(houseState);
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updateHouse = (newHouse: any) => {
    houseState = newHouse;
    notifySubscribers();
  };

  const getHouseWithoutLoading = async () => {
    if (!isAuthenticated) return
    if (typeof houseId === "undefined" || houseId === '') return
    try {
      const { data } = await axios.get(`/house/detail/${houseId}`)
  
      updateHouse((prevState: any) => ({
        ...prevState,
        ...data
      }));
    } catch (e) {}
  }

  return {
    house,
    setHouse: updateHouse,
    getHouse: getHouseWithoutLoading
  }
}
