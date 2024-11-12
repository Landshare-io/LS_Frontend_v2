import { useState, useEffect } from "react";
import axios from "./nft-game-axios";
import { useGlobalContext } from "../../../context/GlobalContext";

export default function useGetHouse(houseId: number | string) {
  const { isAuthenticated } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false)
  const [house, setHouse] = useState({
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
  });

  useEffect(() => {
    (async () => {
      await getHouse()
    })()
  }, [isAuthenticated, houseId])

  const getHouse = async () => {
    if (!isAuthenticated) return
    if (typeof houseId === "undefined" || houseId === '') return
    const { data } = await axios.get(`/house/detail/${houseId}`)

    setHouse((prevState) => ({
      ...prevState,
      ...data
    }));
  }

  return {
    house,
    setHouse,
    getHouse,
    isLoading,
    setIsLoading
  }
}
