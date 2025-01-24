import { useState, useEffect } from "react";
import axios from "axios";

export type PRICE_DATA = {
  prices: any[],
  market_caps: any[],
  total_volumes: any[]
}

export default function useFetchLandData(dueTimeStamp: Date, now: number) {
  const [isLoading, setIsLoading] = useState(true);
  const [price, setPrice] = useState<PRICE_DATA>({ 
    prices: [], 
    market_caps: [], 
    total_volumes: []
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      try{
        const { data: { data: { data: { quotes: priceData } } } } = await axios.get('/api/landPriceProxy');
        let market_caps = [];
        let prices = [];
        let total_volumes = [];
        for (let i = 0; i < priceData?.length; i++) {
          if (Math.floor(Date.parse(priceData[i].timestamp) / 1000) >= Math.floor(Number(dueTimeStamp) / 1000) && Math.floor(Date.parse(priceData[i].timestamp) / 1000) <= Math.floor(Number(now) / 1000)) {
            let market_cap = [
              priceData[i].timestamp, priceData[i].quote.USD.market_cap
            ];
            let total_volume = [
              priceData[i].timestamp, priceData[i].quote.USD.volume_24h
            ];
            let price = [
              priceData[i].timestamp, priceData[i].quote.USD.price
            ];
            market_caps.push(market_cap);
            prices.push(price);
            total_volumes.push(total_volume);
          }
        }
        let returnData = { prices: prices, market_caps: market_caps, total_volumes: total_volumes };
        setPrice(returnData);
      }catch(err){
        console.log(err);
      }
      setIsLoading(false)
    })()
  }, [])

  return {
    price,
    isLoading
  }
}
