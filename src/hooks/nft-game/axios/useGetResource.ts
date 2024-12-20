import { useState, useEffect } from "react"
import axios from "./nft-game-axios"
import { useGlobalContext } from "../../../context/GlobalContext"

let resourceState = [0, 0, 0, 0, 0]
let userRewardState = [0, 0, 0, 0, 0];
let maxPowerLimitState = 0;
let boostItemState = { hasItem: 0, item: 0 };

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

export default function useGetResource() {
  const { isAuthenticated } = useGlobalContext()
  const [resource, setResource] = useState(resourceState)
  const [userReward, setUserReward] = useState(userRewardState)
  const [maxPowerLimit, setMaxPowerLimit] = useState(maxPowerLimitState)
  const [boostItem, setBoostItem] = useState<any>(boostItemState)

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setResource(resourceState);
      setUserReward(userRewardState);
      setMaxPowerLimit(maxPowerLimitState);
      setBoostItem(boostItemState);
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  // Define setter functions that update both singleton state and subscribers
  const updateResource = (newResource: number[]) => {
    resourceState = newResource;
    notifySubscribers();
  };

  const updateUserReward = (newReward: number[]) => {
    userRewardState = newReward;
    notifySubscribers();
  };

  const updateMaxPowerLimit = (newLimit: number) => {
    maxPowerLimitState = newLimit;
    notifySubscribers();
  };

  const updateBoostItem = (newBoost: typeof boostItemState) => {
    boostItemState = newBoost;
    notifySubscribers();
  };

  useEffect(() => {
    if (isAuthenticated) {
      getResources()
    }
  }, [isAuthenticated])

  const getResources = async () => {
    if (!isAuthenticated) return
    try {
      const { data: resourceData } = await axios.get('/resource/user');
  
      updateResource([
        resourceData.power > resourceData.maxPowerLimit ? resourceData.maxPowerLimit : resourceData.power, 
        resourceData.lumber, 
        resourceData.brick, 
        resourceData.concrete, 
        resourceData.steel
      ])
      updateUserReward([
        resourceData.userReward?.lumber ?? 0,
        resourceData.userReward?.brick ?? 0,
        resourceData.userReward?.concrete ?? 0,
        resourceData.userReward?.steel ?? 0,
        resourceData.userReward?.token ?? 0
      ])
      updateMaxPowerLimit(resourceData.maxPowerLimit)
      updateBoostItem(resourceData.boostItem)
    } catch (err) {
      console.log(err)
    }
  }

  return {
    resource,
    setResource: updateResource,
    userReward,
    setUserReward: updateUserReward,
    maxPowerLimit,
    getResources,
    boostItem,
    setBoostItem: updateBoostItem,
    setMaxPowerLimit: updateMaxPowerLimit
  }
}
