import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import APIConsumerAbi from "../../../abis/APIConsumer.json";
import { API_CONSUMER_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function usePropertyValue() {
  const { data, isError, isLoading, error } = useReadContract({
    address: API_CONSUMER_CONTRACT_ADDRESS,
    abi: APIConsumerAbi,
    functionName: "propertyValue",
    chainId: bsc.id
  })

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching APIConsumerContract propertyValue error', error)
    return 0
  }

  return data
}
