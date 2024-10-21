import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import LpTokenV1Abi from "../../../abis/LpTokenV1.json";
import { LP_TOKEN_V1_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useGetReserves() {
  const { data, isError, isLoading, error } = useReadContract({
    address: LP_TOKEN_V1_CONTRACT_ADDRESS,
    abi: LpTokenV1Abi,
    functionName: "getReserves",
    chainId: bsc.id
  })

  if (isLoading) return [0, 0, 0]
  if (isError) {
    console.log('Fetching LpTokenV2Contract getReserves error', error)
    return [0, 0, 0]
  }

  return data
}
