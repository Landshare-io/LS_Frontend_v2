import { useState } from "react"
import axios from "./nft-game-axios"

export default function useGetHouses() {
  const [houses, setHouses] = useState([])

  const getHouses = async () => {
    const { data: houseData } = await axios.get('/house/find-by-user');

    setHouses(houseData)
  }

  return {
    houses,
    getHouses
  }
}
