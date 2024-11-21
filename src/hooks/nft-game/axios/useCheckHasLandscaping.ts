import { useEffect, useState } from "react"
import axios from "./nft-game-axios"

let hasLandscapingState = false

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

export default function useCheckHasLandscaping(houseId: number | string) {
  const [hasLandscaping, setHasLandscaping] = useState(hasLandscapingState)

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setHasLandscaping(hasLandscapingState);
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updateHasLandscaping = (newHasLandscaping: boolean) => {
    hasLandscapingState = newHasLandscaping;
    notifySubscribers();
  };
  
  useEffect(() => {
    (async () => {
      await checkHasLandscaping()
    })()
  }, [houseId])
  
  const checkHasLandscaping = async () => {
    try {
      if (typeof houseId === "undefined" || houseId === '') return
      const { data } = await axios.get(`/has-item/has-landscaping/${houseId}`)

      updateHasLandscaping(data)
    } catch (error: any) {
      console.log(error.response.data.message, error)
      updateHasLandscaping(false)
    }
  }

  return { hasLandscaping, setHasLandscaping: updateHasLandscaping, checkHasLandscaping }
}
