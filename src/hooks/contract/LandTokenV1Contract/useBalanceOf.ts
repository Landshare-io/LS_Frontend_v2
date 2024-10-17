import { useReadContract } from "wagmi";
import { Address } from "viem";
import { bsc } from "viem/chains";
import LandTokenAbi from "../../../abis/LandToken.json";
import { LAND_TOKEN_V1_CONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseBalanceOfProps {
  address: Address | undefined;
}

export default function useBalanceOf({ address }: UseBalanceOfProps) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: LAND_TOKEN_V1_CONTRACT_ADDRESS,
    abi: LandTokenAbi,
    functionName: "balanceOf",
    chainId: bsc.id,
    args: [address]
  })

  if (typeof address == 'undefined') return { data: 0, isLoading, refetch }
  if (isLoading) return { data: 0, isLoading, refetch }
  if (isError) {
    console.log('Fetching LandTokenContract balanceOf error', error)
    return { data: 0, isLoading, refetch }
  }

  return { data, isLoading, refetch }
}
