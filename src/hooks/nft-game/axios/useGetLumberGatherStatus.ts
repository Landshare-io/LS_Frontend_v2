import { useState, useEffect } from "react";
import axios from "./nft-game-axios";
import { useGlobalContext } from "../../../context/GlobalContext";
import { validateItemOneDay, getRemainingTime, getMaxItemDate } from "../../../utils/helpers/validator";

export default function useGetLumberGatherStatus(oneDayTime: number) {
  const { isAuthenticated } = useGlobalContext();
  const [isHavingTree, setIsHavingTree] = useState(false);
  const [gatheringLumberStatus, setGatheringLumberStatus] = useState({
    canGather: true,
    remainingTime: 0,
  });
  const [todayLumber, setTodayLumber] = useState(0);

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

      setIsHavingTree(data);
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
        setGatheringLumberStatus({
          canGather: false,
          remainingTime: getRemainingTime(getMaxItemDate(gatherItems), oneDayTime)
        })
      } else {
        setGatheringLumberStatus({
          canGather: true,
          remainingTime: 0
        })
      }
      setTodayLumber(countGatheredToday);
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
