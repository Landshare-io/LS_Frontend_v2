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
    const { data: houseData } = await axios.get('/house/find-by-user');

    setHouses(houseData)
  }

  return {
    houses,
    getHouses
  }
}
