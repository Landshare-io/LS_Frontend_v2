import { useReadContract } from "wagmi";
import { Address } from "viem";
import LpTokenV2Abi from "../../../abis/LpTokenV2.json";
import { LAND_TOKEN_CONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseBalanceOfProps {
  chainId: number;
  address: Address | undefined;
}

export default function useBalanceOf({ chainId, address }: UseBalanceOfProps) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: LAND_TOKEN_CONTRACT_ADDRESS[chainId],
    abi: LpTokenV2Abi,
    functionName: "balanceOf",
    chainId: chainId,
    args: [address]
  })

  if (typeof address == 'undefined') return { data: 0, refetch }
  if (isLoading) return { data: 0, refetch }
  if (isError) {
    console.log('Fetching LandTokenContract balanceOf error', error)
    return { data: 0, refetch }
  }

  return { data, refetch }
}
