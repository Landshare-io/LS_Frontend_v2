import { useReadContract } from "wagmi";
import { Address } from "viem";
import LpTokenV2Abi from "../../../abis/LpTokenV2.json";
import { LAND_TOKEN_CONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseBalanceOfProps {
  chainId: number;
  address: Address | undefined;
}

export default function useBalanceOf({ chainId, address }: UseBalanceOfProps) {
  const { data, isError, isLoading, error } = useReadContract({
    address: LAND_TOKEN_CONTRACT_ADDRESS[chainId],
    abi: LpTokenV2Abi,
    functionName: "balanceOf",
    chainId: chainId,
    args: [address]
  })

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching LandTokenContract balanceOf error', error)
    return 0
  }

  return data
}
