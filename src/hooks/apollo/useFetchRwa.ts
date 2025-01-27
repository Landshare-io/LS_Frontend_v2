import { useState, useEffect } from "react";
import { formatEther } from "ethers";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { LAND_PRICE_SUBGRAPH_URL } from "../../config/constants/environments";

export default function useFetchRwa() {
  const [rwaData, setRwaData] = useState<any[]>([])
  
  useEffect(() => {
    (async () => {
      try {
        const pricesQuery = `
          query{
            valueUpdateds {
              blockTimestamp
              value
              id
            }
          }
        `;
        const client = new ApolloClient({
          uri: LAND_PRICE_SUBGRAPH_URL,
          cache: new InMemoryCache(),
        });
        const rwaData = await client
          .query({
            query: gql(pricesQuery),
          })
        if (rwaData) {
          const returnData: any[] = [];
          rwaData.data.valueUpdateds.filter((value: any) => Number(value.blockTimestamp) > 1702900000).sort((a: any, b: any) => {
            return Number(a.blockTimestamp) - Number(b.blockTimestamp);
          }).map((data: any) => {
            returnData.push([
              Number(data.blockTimestamp) * 1000,
              parseFloat(Number(formatEther(data.value)).toFixed(6))
            ])
          });
          returnData.push([
            Date.now(),
            returnData[returnData.length - 1][1]
          ]);
          setRwaData(returnData);
        }
      } catch (e) { console.log(e) }
    })()
  }, [])

  return rwaData
}
