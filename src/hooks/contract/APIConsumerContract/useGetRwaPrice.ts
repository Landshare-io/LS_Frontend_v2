import { useReadContract } from "wagmi";
import { BigNumberish, formatEther } from "ethers";
import { bsc } from "viem/chains";
import APIConsumerAbi from "../../../abis/APIConsumer.json";
import LandshareBuySaleAbi from "../../../abis/LandshareBuySale.json"
import { API_CONSUMER_CONTRACT_ADDRESS, LANDSHARE_BUY_SALE_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useGetRwaPrice(chainId: number) {
  const { data, isError, isLoading, error } = useReadContract({
    address: chainId == bsc.id ? API_CONSUMER_CONTRACT_ADDRESS[bsc.id] : LANDSHARE_BUY_SALE_CONTRACT_ADDRESS[chainId],
    abi: chainId == bsc.id ? APIConsumerAbi : LandshareBuySaleAbi,
    functionName: chainId == bsc.id ? "getRWAPrice" : "offeringSecurityToUSDPrice",
    chainId: chainId
  })

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching APIConsumerContract getRWAPrice error', error)
    return 0
  }

  return chainId == bsc.id ? formatEther((data) as BigNumberish) : data
}
