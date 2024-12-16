import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import APIConsumerAbi from "../../../abis/APIConsumer.json";
import { API_CONSUMER_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function usePropertyValues(chainId: number, id: string) {
  const { data, isError, isLoading, error } = useReadContract({
    address: API_CONSUMER_CONTRACT_ADDRESS[bsc.id],
    abi: APIConsumerAbi,
    functionName: "getPropertyValues",
    chainId: bsc.id,
    args: [id]
  })

  if (isLoading) return {
    isLoading,
    data: 0
  }
  if (isError) {
    console.log('Fetching APIConsumerContract propertyValue error', error)
    return { isLoading: false, data: 0 }
  }

  return {
    isLoading,
    data
  }
}
