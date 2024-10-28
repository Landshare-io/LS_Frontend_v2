import { useState, useEffect } from "react"
import axios from "./nft-game-axios"
import { useGlobalContext } from "../../../context/GlobalContext"

export default function useGetHouses() {
  const { isAuthenticated } = useGlobalContext()
  const [houses, setHouses] = useState([])

  useEffect(() => {
    if (isAuthenticated) {
      getHouses()
    }
  }, [isAuthenticated])

  const getHouses = async () => {
    if (!isAuthenticated) return
    const { data: houseData } = await axios.get('/house/find-by-user');

    if (houseData.length > 0) {
      setHouses(houseData.sort((houseA: any, houseB: any) => houseA.id - houseB.id))
    } else setHouses([])
  }

  return {
    houses,
    getHouses
  }
}
