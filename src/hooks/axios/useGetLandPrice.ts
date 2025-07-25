import { useState, useEffect } from "react";
import axios from "axios";
import numeral from "numeral";

export default function useGetLandPrice() {
  const [isLoading, setIsLoading] = useState(true);
  const [price, setPrice] = useState(0);
  const [circulatingSupply, setCirculatingSupply] = useState(0);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        // Fetch price directly from landshare.xyz
        const { data: { landshare: { usd: priceData } } } = 
          await axios.get("https://landshare.xyz/land_market");

        // Fetch circulating supply from your API
        const { data: circulatingSupplyData } = 
          await axios.get("https://api.landshare.io/api/test?q=circulating");

        setPrice(Number(numeral(Number(priceData)).format("0.[000]")));
        setCirculatingSupply(circulatingSupplyData);
      } catch (e) {
        console.error("Error occurred while fetching data: ", e);
      }
      setIsLoading(false);
    })();
  }, []);

  return {
    price,
    isLoading,
    circulatingSupply
  };
}
