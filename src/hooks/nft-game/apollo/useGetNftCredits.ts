import { useState, useEffect } from "react";
import { Address } from "viem";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import axios from "../axios/nft-game-axios";
import { useGlobalContext } from "../../../context/GlobalContext";
import { APOLLO_RWA_BUY_URL, APOLLO_RWA_URL } from "../../../config/constants/environments";

export default function useGetNftCredits(address: Address | undefined) {
  const { isAuthenticated } = useGlobalContext()
  const [nftCredits, setNftCredits] = useState(0)
  const [totalCredits, setTotalCredits] = useState(0)

  useEffect(() => {
    if (address) {
      getNftCredits()
    }
  }, [address])

  const getNftCredits = () => {
    if (!isAuthenticated) return
    const query1 = `
      query {
        buyTokensEvents(where: {buyer: "${address}"}) {
          id
          buyer
          securities
          amountSecurities
        }
      }`;

    const query2 = `
      query {
        rwasolds(where: {user: "${address}"}) {
          id
          user
          amount
        }
      }`;


    const client1 = new ApolloClient({
      uri: APOLLO_RWA_BUY_URL,
      cache: new InMemoryCache(),
    });

    const client2 = new ApolloClient({
      uri: APOLLO_RWA_URL,
      cache: new InMemoryCache(),
    });

    Promise.all([
      client1.query({ query: gql(query1) }),
      client2.query({ query: gql(query2) }),
    ]).then(async ([res1, res2]) => {
      const totalNftCreditAmount1 = res1.data.buyTokensEvents.length > 0 ? res1.data.buyTokensEvents.map((event: any) => event.amountSecurities).reduce((a: number, b: number) => Number(a) + Number(b)) : 0;
      const totalNftCreditAmount2 = res2.data.rwasolds.length > 0 ? res2.data.rwasolds.map((event: any) => event.amount).reduce((a: number, b: number) => Number(a) + Number(b)) : 0;
      const { data: currentUser } = await axios.get('/user/get-detail');

      // Calculate NFTCredits
      const nftCredits = Number(totalNftCreditAmount1) - Number(totalNftCreditAmount2) - Number(currentUser.spentNftCredits);

      // Set the calculated NFTCredits
      setTotalCredits(totalNftCreditAmount1)
      setNftCredits(nftCredits);
    }).catch(err => {
      console.log(err.response?.data.message, err);
    });
  }

  return {
    nftCredits,
    totalCredits,
    getNftCredits
  }
}
