import { useState, useEffect } from "react"
import axios from "./nft-game-axios"
import { useGlobalContext } from "../../../context/GlobalContext"

export default function useGetResource() {
  const { isAuthenticated } = useGlobalContext()
  const [resource, setResource] = useState([0, 0, 0, 0, 0])
  const [userReward, setUserReward] = useState([0, 0, 0, 0, 0])
  const [maxPowerLimit, setMaxPowerLimit] = useState(0)
  const [boostItem, setBoostItem] = useState<any>({
    hasItem: 0,
    item: 0
  })

  useEffect(() => {
    if (isAuthenticated) {
      getResources()
    }
  }, [isAuthenticated])

  const getResources = async () => {
    if (!isAuthenticated) return
    const { data: resourceData } = await axios.get('/resource/user');

    setResource([
      resourceData.power > resourceData.maxPowerLimit ? resourceData.maxPowerLimit : resourceData.power, 
      resourceData.lumber, 
      resourceData.brick, 
      resourceData.concrete, 
      resourceData.steel
    ])
    setUserReward([
      resourceData.userReward?.lumber ?? 0,
      resourceData.userReward?.brick ?? 0,
      resourceData.userReward?.concrete ?? 0,
      resourceData.userReward?.steel ?? 0,
      resourceData.userReward?.token ?? 0
    ])
    setMaxPowerLimit(resourceData.maxPowerLimit)
    setBoostItem(resourceData.boostItem)
  }

  return {
    resource,
    setResource,
    userReward,
    setUserReward,
    maxPowerLimit,
    getResources,
    boostItem,
    setBoostItem
  }
}
