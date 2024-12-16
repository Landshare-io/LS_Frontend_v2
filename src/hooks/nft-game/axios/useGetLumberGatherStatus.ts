import { useState, useEffect } from "react";
import axios from "./nft-game-axios";
import { useGlobalContext } from "../../../context/GlobalContext";
import { validateItemOneDay, getRemainingTime, getMaxItemDate } from "../../../utils/helpers/validator";

let isHavingTreeState = false
let gatheringLumberStatusState = { canGather: true, remainingTime: 0 }
let todayLumberState = 0

// Subscribers to update all components on state change
const subscribers = new Set<Function>();

// Helper to update all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

export default function useGetLumberGatherStatus(oneDayTime: number) {
  const { isAuthenticated } = useGlobalContext();
  const [isHavingTree, setIsHavingTree] = useState(isHavingTreeState);
  const [gatheringLumberStatus, setGatheringLumberStatus] = useState(gatheringLumberStatusState);
  const [todayLumber, setTodayLumber] = useState(todayLumberState);

  useEffect(() => {
    // Subscribe on mount
    const update = () => {
      setIsHavingTree(isHavingTreeState);
      setGatheringLumberStatus(gatheringLumberStatusState);
      setTodayLumber(todayLumberState);
    };
    subscribers.add(update);

    // Cleanup on unmount
    return () => {
      subscribers.delete(update);
    };
  }, []);

  const updateIsHavingTree = (newIsHavingTree: boolean) => {
    isHavingTreeState = newIsHavingTree;
    notifySubscribers();
  };

  const updateGatheringLumberStatus = (newGatheringLumberStatus: any) => {
    gatheringLumberStatusState = newGatheringLumberStatus;
    notifySubscribers();
  };

  const updateTodayLumber = (newTodayLumber: number) => {
    todayLumberState = newTodayLumber;
    notifySubscribers();
  };

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        await getHavingTreeData();
        await setGatherStatus();
      }
    })()
  }, [isAuthenticated])

  const getHavingTreeData = async () => {
    try {
      if (!isAuthenticated) return
      const { data } = await axios.get('/has-item/having-tree');

      updateIsHavingTree(data);
    } catch (error: any) {
      console.log(error.response.data.message, error)
    }
  };

  async function setGatherStatus() {
    try {
      if (!isAuthenticated) return
      const { data: gatherItems } = await axios.get('/has-item/gather-status')
      const maxCountToGather = isHavingTree ? 3 : 2;
      let countGatheredToday = 0;

      for (const gatherItem of gatherItems) {
        if (validateItemOneDay(gatherItem, oneDayTime)) {
          countGatheredToday++
        }
      }
      if (countGatheredToday >= maxCountToGather) {
        updateGatheringLumberStatus({
          canGather: false,
          remainingTime: getRemainingTime(getMaxItemDate(gatherItems), oneDayTime)
        })
      } else {
        updateGatheringLumberStatus({
          canGather: true,
          remainingTime: 0
        })
      }
      updateTodayLumber(countGatheredToday);
    } catch (error: any) {
      console.log(error.response.data.message, error)
    }
  }

  return {
    gatheringLumberStatus,
    todayLumber,
    isHavingTree,
    getHavingTreeData,
    setGatherStatus,
  }
}
