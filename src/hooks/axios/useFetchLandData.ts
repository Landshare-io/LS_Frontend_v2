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
      setIsLoading(true);
      try {
        const res = await axios.get('/api/landPriceProxy');
        const priceData = res.data?.data?.data?.quotes;

        const filtered = priceData.filter((p: any) => {
          const ts = new Date(p.timestamp).getTime();
          return ts >= dueTimeStamp.getTime() && ts <= now;
        });

        if (filtered.length === 0) {
          setIsLoading(false);
          return;
        }

        const first = filtered[0];
        const last = filtered[filtered.length - 1];

        const market_caps = filtered.map((p: any) => [
          new Date(p.timestamp).getTime(), p.quote.USD.market_cap
        ]);

        const prices = filtered.map((p: any) => [
          new Date(p.timestamp).getTime(), p.quote.USD.price
        ]);

        const total_volumes = filtered.map((p: any) => [
          new Date(p.timestamp).getTime(), p.quote.USD.volume_24h
        ]);

        setPrice({ prices, market_caps, total_volumes });
        setEarlyMarketCap(first.quote.USD.market_cap);
        setEarlyVolume24(first.quote.USD.volume_24h);
        setEarlyPrice(first.quote.USD.price);
        setLatestMarketCap(last.quote.USD.market_cap);
        setLatestVolume24(last.quote.USD.volume_24h);
        setLatestPrice(last.quote.USD.price);
      } catch (e) {
        console.error("Error occurred while fetching data: ", e);
      }

      setIsLoading(false);
    })();
  }, []); 

  return {
    price,
    isLoading,
    earlyMarketCap,
    earlyVolume24,
    earlyPrice,
    latestMarketCap,
    latestVolume24,
    latestPrice
  };
}
