import { useState, useEffect } from "react";
import { formatEther } from "ethers";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { RWA_PRICE_SUBGRAPH_URL, RWA_PRICE_SUBGRAPH_URL_V2 } from "../../config/constants/environments";

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
          uri: RWA_PRICE_SUBGRAPH_URL,
          cache: new InMemoryCache(),
        });

        const client_v2 = new ApolloClient({
          uri: RWA_PRICE_SUBGRAPH_URL_V2,
          cache: new InMemoryCache(),
        });

        Promise.all([
          client.query({ query: gql(pricesQuery) }),
          client_v2.query({ query: gql(pricesQuery) }),
        ]).then(async ([res1, res1_v2]) => {
          const returnData: any[] = [];
          res1.data.valueUpdateds.filter((value: any) => Number(value.blockTimestamp) > 1702900000).sort((a: any, b: any) => {
            return Number(a.blockTimestamp) - Number(b.blockTimestamp);
          }).map((data: any) => {
            returnData.push([
              Number(data.blockTimestamp) * 1000,
              parseFloat(Number(formatEther(data.value)).toFixed(6))
            ])
          });
          res1_v2.data.valueUpdateds.filter((value: any) => Number(value.blockTimestamp) > 1743723300).sort((a: any, b: any) => {
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
        })
      } catch (e) { console.log(e) }
    })()
  }, [])

  return rwaData
}
