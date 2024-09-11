import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import APIConsumerAbi from "../../../abis/APIConsumer.json";
import { config } from "../../../wagmi";
import { APICONSUMERCONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useReserveRwa() {
  const { data } = useReadContract({
    address: APICONSUMERCONTRACT_ADDRESS,
    abi: APIConsumerAbi,
    functionName: "reserveRWA",
    chainId: bsc.id
  })

  return data
}
