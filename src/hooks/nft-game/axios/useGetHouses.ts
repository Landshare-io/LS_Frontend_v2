import { useState, useEffect } from "react"
import axios from "./nft-game-axios"
import { useGlobalContext } from "../../../context/GlobalContext"

let housesState: any[] = []

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

export default function useGetHouses() {
  const { isAuthenticated } = useGlobalContext()
  const [houses, setHouses] = useState(housesState)

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setHouses(housesState);
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updateHouses = (newHouses: any[]) => {
    housesState = newHouses;
    notifySubscribers();
  };

  useEffect(() => {
    if (isAuthenticated) {
      getHouses()
    }
  }, [isAuthenticated])

  const getHouses = async () => {
    if (!isAuthenticated) return
    try {
      const { data: houseData } = await axios.get('/house/find-by-user');
  
      if (houseData.length > 0) {
        updateHouses(houseData.sort((houseA: any, houseB: any) => houseA.id - houseB.id))
      } else updateHouses([])
    } catch (err) {
      console.log(err)
    }
  }

  return {
    houses,
    getHouses
  }
}
