import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import APIConsumerAbi from "../../../abis/APIConsumer.json";
import { APICONSUMERCONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useGetTotalValue() {
  const { data } = useReadContract({
    address: APICONSUMERCONTRACT_ADDRESS,
    abi: APIConsumerAbi,
    functionName: "propertyValue",
    chainId: bsc.id
  })

  return data
}
