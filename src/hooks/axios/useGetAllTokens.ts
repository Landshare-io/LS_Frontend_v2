import { useState, useEffect } from "react";
import { LIVE_COIN_LIST_URL, LIVE_COIN_API_KEY } from "../../config/constants/environments";

export default function useGetAllTokens() {
  const [isLoading, setIsLoading] = useState(true);
  const [allTokens, setAllTokens] = useState([]);

  useEffect(() => {
    (async () => {
      try {
      setIsLoading(true)
      const res = await fetch(
        new Request(LIVE_COIN_LIST_URL),
        {
          method: "POST",
          headers: new Headers({
            "content-type": "application/json",
            "x-api-key": LIVE_COIN_API_KEY,
          }),
          body: JSON.stringify({
            currency: "USD",
            sort: "rank",
            order: "ascending",
            offset: 0,
            limit: 50,
            meta: true,
          }),
        }
      );
      setAllTokens(await res.json());
    } catch (e) {
      console.error("Error occurred while fetching data: ", e);
    }
      setIsLoading(false)
    })()
  }, [])

  return {
    allTokens,
    isLoading
  }
}
