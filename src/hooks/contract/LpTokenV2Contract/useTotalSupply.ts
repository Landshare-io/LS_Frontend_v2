import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import LpTokenV2Abi from "../../../abis/LpTokenV2.json";
import { LP_TOKEN_V2_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useTotalSupply(chainId: number) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: LP_TOKEN_V2_CONTRACT_ADDRESS[bsc.id],
    abi: LpTokenV2Abi,
    functionName: "totalSupply",
    chainId: bsc.id
  })

  if (isLoading) return { data: 0, isLoading, refetch }
  if (isError) {
    console.log('Fetching LpTokenV2Contract totalSupply error', error)
    return { data: 0, isLoading, refetch }
  }

  return { data, isLoading, refetch }
}
