import { useState, useEffect } from "react";
import axios from "axios";
import numeral from "numeral";

export default function useGetLandPrice() {
  const [isLoading, setIsLoading] = useState(true);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        
        try {
          const { data } = await axios.get("https://landshare.xyz/land_market");
      
          setPrice(Number(numeral(data.price).format("0.[000]")));
        } catch (e) {
          console.error("Error occurred while fetching data: ", e);
        }
  
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setPrice(1);
        setIsLoading(false);
      }
    })();
  }, []);

  return { price, isLoading };
}
