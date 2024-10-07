import { useReadContract } from "wagmi";
import APIConsumerAbi from "../../../abis/APIConsumer.json";
import { API_CONSUMER_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useReserveRwa(chainId: number) {
  const { data, isError, isLoading, error } = useReadContract({
    address: API_CONSUMER_CONTRACT_ADDRESS[chainId],
    abi: APIConsumerAbi,
    functionName: "reserveRWA",
    chainId: chainId
  })

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching APIConsumerContract reserveRWA error', error)
    return 0
  }

  return data
}
