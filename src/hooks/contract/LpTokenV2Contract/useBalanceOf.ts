import { useReadContract } from "wagmi";
import { Address } from "viem";
import { bsc } from "viem/chains";
import LpTokenV2Abi from "../../../abis/LpTokenV2.json";
import { LP_TOKEN_V2_CONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseBalanceOfProps {
  chainId: number;
  address: Address | undefined;
}

export default function useBalanceOf({ chainId, address }: UseBalanceOfProps) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: LP_TOKEN_V2_CONTRACT_ADDRESS[bsc.id],
    abi: LpTokenV2Abi,
    functionName: "balanceOf",
    args: [address],
    chainId: bsc.id
  })

  if (typeof address == 'undefined') return { data: 0, refetch }
  if (isLoading) return { data: 0, refetch }
  if (isError) {
    console.log('Fetching LpTokenV2Contract balanceOf error', error)
    return { data: 0, refetch }
  }

  return { data, refetch }
}
