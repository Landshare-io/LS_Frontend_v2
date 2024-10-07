import { useReadContract } from "wagmi";
import LpTokenV2Abi from "../../../abis/LpTokenV2.json";
import { LP_TOKEN_V2_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useGetReserves(chainId: number) {
  const { data, isError, isLoading, error } = useReadContract({
    address: LP_TOKEN_V2_CONTRACT_ADDRESS[chainId],
    abi: LpTokenV2Abi,
    functionName: "getReserves"
  })

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching LpTokenV2Contract getReserves error', error)
    return 0
  }

  return data
}
