import { useState, useEffect } from "react";
import axios from "axios";
import numeral from "numeral";

export default function useGetLandPrice() {
  const [isLoading, setIsLoading] = useState(true);
  const [price, setPrice] = useState(0);
  const [circulatingSupply, setCirculatingSupply] = useState(0);

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      try {
        const { data: { price: priceData } } = await axios.get('/api/landMarketProxy');
        const { data: circulatingSupplyData } = await axios.get('https://api.landshare.io/api/test?q=circulating');

        setPrice(Number(numeral(Number(priceData)).format('0.[000]')))
        setCirculatingSupply(circulatingSupplyData)
      } catch (e) {
        console.error("Error occurred while fetching data: ", e);
        // handle the error appropriately based on your app, this is an example.
      }
      setIsLoading(false)
    })()
  }, [])

  return {
    price,
    isLoading,
    circulatingSupply
  }
}
