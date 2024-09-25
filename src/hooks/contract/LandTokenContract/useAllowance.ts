import { useReadContract } from "wagmi";
import LpTokenV2Abi from "../../../abis/LpTokenV2.json";
import { LAND_TOKEN_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { Address } from "viem";

export default function useAllowance(chainId: number, address: Address | undefined, spender: Address | undefined) {
  const { data, isError, isLoading, error } = useReadContract({
    address: LAND_TOKEN_CONTRACT_ADDRESS[chainId ?? 56],
    abi: LpTokenV2Abi,
    functionName: "allowance",
    chainId: chainId ?? 56,
    args: [address, spender]
  })

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching LandTokenContract allowance error', error)
    return 0
  }

  return data
}
