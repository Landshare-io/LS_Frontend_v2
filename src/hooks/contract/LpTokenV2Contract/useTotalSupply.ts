import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import LpTokenV2Abi from "../../../abis/LpTokenV2.json";
import { LPTOKENV2CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useTotalSupply() {
  const { data, isError, isLoading, error } = useReadContract({
    address: LPTOKENV2CONTRACT_ADDRESS,
    abi: LpTokenV2Abi,
    functionName: "totalSupply",
    chainId: bsc.id
  })

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching LpTokenV2Contract totalSupply error', error)
    return 0
  }

  return data
}
