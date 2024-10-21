import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import LpTokenV1Abi from "../../../abis/LpTokenV1.json";
import { LP_TOKEN_V1_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useTotalSupply() {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: LP_TOKEN_V1_CONTRACT_ADDRESS,
    abi: LpTokenV1Abi,
    functionName: "totalSupply",
    chainId: bsc.id
  })

  if (isLoading) return { data: 0, refetch }
  if (isError) {
    console.log('Fetching LpTokenV2Contract totalSupply error', error)
    return { data: 0, refetch }
  }

  return { data, refetch }
}
