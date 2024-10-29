import { useEffect, useState } from "react"
import axios from "./nft-game-axios";

export default function useCheckHasGarden(houseId: number | string) {
  const [hasGarden, setHasGarden] = useState(false)

  useEffect(() => {
    (async () => {
      await checkHasGarden()
    })()
  }, [])

  async function checkHasGarden() {
    try {
      const { data } = await axios.get(`/has-item/has-garden/${houseId}`)

      setHasGarden(data)
    } catch (error: any) {
      console.log(error.response.data.message, error)
      setHasGarden(false)
    }
  }

  return { hasGarden, setHasGarden, checkHasGarden }
}
