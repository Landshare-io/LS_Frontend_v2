import { useState, useEffect } from "react";
import axios from "axios";
import { LANDSHARE_COST_URL } from "../../config/constants/environments";

export default function useGetLandPrice() {
  const [isLoading, setIsLoading] = useState(true);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      const { data: { landshare: { usd: priceData } } } = await axios.get(LANDSHARE_COST_URL);

      setPrice(priceData)
      setIsLoading(false)
    })()
  }, [])

  return {
    price,
    isLoading
  }
}
