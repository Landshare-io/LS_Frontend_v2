import { useState } from "react"
import axios from "./nft-game-axios"

export default function useGetHouses() {
  const [resource, setResource] = useState([0, 0, 0, 0, 0])
  const [maxPowerLimit, setMaxPowerLimit] = useState(0)

  const getResources = async () => {
    const { data: resourceData } = await axios.get('/resource/user');

    setResource([
      resourceData.power > resourceData.maxPowerLimit ? resourceData.maxPowerLimit : resourceData.power, 
      resourceData.lumber, 
      resourceData.brick, 
      resourceData.concrete, 
      resourceData.steel
    ])
    setMaxPowerLimit(resourceData.maxPowerLimit)
  }

  return {
    resource,
    maxPowerLimit,
    getResources
  }
}
