import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import numeral from "numeral";

async function fetchWithRetry<T = any>(
  url: string,
  retries = 3,
  delay = 500
): Promise<AxiosResponse<T>> {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get<T>(url);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((res) => setTimeout(res, delay * (i + 1)));
    }
  }
  throw new Error(`Failed to fetch: ${url}`);
}

export default function useGetLandPrice() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [price, setPrice] = useState<number>(0);
  const [circulatingSupply, setCirculatingSupply] = useState<number>(0);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data: { price: priceData } } = await fetchWithRetry<{ price: number }>('/api/landMarketProxy');
        const { data: circulatingSupplyData } = await fetchWithRetry<number>('https://api.landshare.io/api/test?q=circulating');

        setPrice(Number(numeral(Number(priceData)).format('0.[000]')));
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
