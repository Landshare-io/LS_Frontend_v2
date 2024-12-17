import { useState, useEffect } from "react";
import axios from "axios";
import numeral from "numeral";
import { LANDSHARE_COST_URL } from "../../config/constants/environments";

export default function useGetLandPrice() {
  const [isLoading, setIsLoading] = useState(true);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true)
        const { data: { landshare: { usd: priceData } } } = await axios.get(LANDSHARE_COST_URL);
  
        setPrice(Number(numeral(Number(priceData)).format("0.[000]")));
        setIsLoading(false)
      } catch (err) {
        console.log(err)
        setPrice(1);
        setIsLoading(false)
      }
    })()
  }, [])

  return {
    price,
    isLoading
  }
}
