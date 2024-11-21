import { useEffect, useState } from "react"
import axios from "./nft-game-axios";

let hasGardenState = false

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

export default function useCheckHasGarden(houseId: number | string) {
  const [hasGarden, setHasGarden] = useState(hasGardenState)

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setHasGarden(hasGardenState);
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updateHasGarden = (newHasGarden: boolean) => {
    hasGardenState = newHasGarden;
    notifySubscribers();
  };
  

  useEffect(() => {
    (async () => {
      await checkHasGarden()
    })()
  }, [houseId])
  
  async function checkHasGarden() {
    try {
      if (typeof houseId === "undefined" || houseId === '') return
      const { data } = await axios.get(`/has-item/has-garden/${houseId}`)

      updateHasGarden(data)
    } catch (error: any) {
      console.log(error.response.data.message, error)
      updateHasGarden(false)
    }
  }

  return { hasGarden, setHasGarden: updateHasGarden, checkHasGarden }
}
