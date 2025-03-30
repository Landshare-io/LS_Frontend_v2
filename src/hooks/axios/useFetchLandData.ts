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
  const [earlyMarketCap, setEarlyMarketCap] = useState(0);
  const [earlyVolume24, setEarlyVolume24] = useState(0);
  const [earlyPrice, setEarlyPrice] = useState(0);
  const [latestMarketCap, setLatestMarketCap] = useState(0);
  const [latestVolume24, setLatestVolume24] = useState(0);
  const [latestPrice, setLatestPrice] = useState(0);

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      try {
        const { data: { data: { data: { quotes: priceData } } } } = await axios.get('/api/landPriceProxy');
        let market_caps = [];
        let prices = [];
        let total_volumes = [];
        let eMarketCapT = Number(new Date(priceData[0].timestamp))
        let eVolume24T = Number(new Date(priceData[0].timestamp))
        let ePriceT = Number(new Date(priceData[0].timestamp))
        let lMarketCapT = Number(new Date(priceData[0].timestamp))
        let lVolume24T = Number(new Date(priceData[0].timestamp))
        let lPriceT = Number(new Date(priceData[0].timestamp))
        let eMarketCap = priceData[0].quote.USD.market_cap
        let lMarketCap = priceData[0].quote.USD.market_cap
        let eVolume24 = priceData[0].quote.USD.volume_24h
        let lVolume24 = priceData[0].quote.USD.volume_24h
        let ePrice = priceData[0].quote.USD.price
        let lPrice = priceData[0].quote.USD.price

        for (let i = 0; i < priceData?.length; i++) {
          if (Math.floor(Date.parse(priceData[i].timestamp) / 1000) >= Math.floor(Number(dueTimeStamp) / 1000) && Math.floor(Date.parse(priceData[i].timestamp) / 1000) <= Math.floor(Number(now) / 1000)) {
            let market_cap = [
              Number(new Date(priceData[i].timestamp)), priceData[i].quote.USD.market_cap
            ];
            let total_volume = [
              Number(new Date(priceData[i].timestamp)), priceData[i].quote.USD.volume_24h
            ];
            let price = [
              Number(new Date(priceData[i].timestamp)), priceData[i].quote.USD.price
            ];

            if (Number(new Date(priceData[i].timestamp)) < Number(eMarketCapT)) {
              eMarketCap = priceData[i].quote.USD.market_cap
              eMarketCapT = Number(priceData[i].timestamp)
            }
            if (Number(new Date(priceData[i].timestamp)) < Number(eVolume24T)) {
              eVolume24 = priceData[i].quote.USD.volume_24h
              eVolume24T = Number(priceData[i].timestamp)
            }
            if (Number(new Date(priceData[i].timestamp)) < Number(ePriceT)) {
              ePrice = priceData[i].quote.USD.price
              ePriceT = Number(priceData[i].timestamp)
            }
            if (Number(new Date(priceData[i].timestamp)) > Number(lMarketCapT)) {
              lMarketCap = priceData[i].quote.USD.market_cap
              lMarketCapT = Number(priceData[i].timestamp)
            }
            if (Number(new Date(priceData[i].timestamp)) > Number(lVolume24T)) {
              lVolume24 = priceData[i].quote.USD.volume_24h
              lVolume24T = Number(priceData[i].timestamp)
            }
            if (Number(new Date(priceData[i].timestamp)) > Number(lPriceT)) {
              lPrice = priceData[i].quote.USD.price
              lPriceT = Number(priceData[i].timestamp)
            }
            market_caps.push(market_cap);
            prices.push(price);
            total_volumes.push(total_volume);
          }
        }
        let returnData = { prices: prices, market_caps: market_caps, total_volumes: total_volumes };
        setPrice(returnData);
        setEarlyMarketCap(eMarketCap)
        setEarlyVolume24(eVolume24)
        setEarlyPrice(ePrice)
        setLatestMarketCap(lMarketCap)
        setLatestVolume24(lVolume24)
        setLatestPrice(lPrice)
      } catch (e) {
        console.error("Error occurred while fetching data: ", e);
      }
      
      setIsLoading(false)
    })()
  }, [])

  return {
    price,
    isLoading,
    earlyMarketCap,
    earlyVolume24,
    earlyPrice,
    latestMarketCap,
    latestVolume24,
    latestPrice
  }
}