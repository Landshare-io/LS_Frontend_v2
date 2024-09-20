import { useState, useEffect } from "react";
import axios from "axios";
import { LANDMARKET_URL } from "../../config/constants/environments";

export default function useGetLandPrice() {
  const [isLoading, setIsLoading] = useState(true);
  const [price, setPrice] = useState(0);
  const [circulatingSupply, setCirculatingSupply] = useState(0);

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      const { data: { price: priceData } } = await axios.get(LANDMARKET_URL);
      const { data: circulatingSupplyData } = await axios.get('https://api.landshare.io/api/test?q=circulating');

      setPrice(priceData)
      setCirculatingSupply(circulatingSupplyData)
      setIsLoading(false)
    })()
  }, [])

  return {
    price,
    isLoading,
    circulatingSupply
  }
}
