import { useEffect, useState } from "react"
import axios from "./nft-game-axios"

export default function useCheckHasLandscaping(houseId: number | string) {
  const [hasLandscaping, setHasLandscaping] = useState(false)
  
  useEffect(() => {
    (async () => {
      await checkHasLandscaping()
    })()
  }, [])

  const checkHasLandscaping = async () => {
    try {
      const { data } = await axios.get(`/has-item/has-landscaping/${houseId}`)

      setHasLandscaping(data)
    } catch (error: any) {
      console.log(error.response.data.message, error)
      setHasLandscaping(false)
    }
  }

  return { hasLandscaping, setHasLandscaping, checkHasLandscaping }
}