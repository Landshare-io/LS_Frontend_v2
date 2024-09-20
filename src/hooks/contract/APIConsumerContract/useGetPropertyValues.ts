import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import APIConsumerAbi from "../../../abis/APIConsumer.json";
import { APICONSUMERCONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function usePropertyValues(id: string) {
  const { data, isError, isLoading, error } = useReadContract({
    address: APICONSUMERCONTRACT_ADDRESS,
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
    return 0
  }

  return {
    isLoading,
    data
  }
}
