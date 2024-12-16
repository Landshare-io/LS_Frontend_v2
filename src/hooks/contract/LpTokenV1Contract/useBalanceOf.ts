import { useReadContract } from "wagmi";
import { Address } from "viem";
import { bsc } from "viem/chains";
import LpTokenV1Abi from "../../../abis/LpTokenV1.json";
import { LP_TOKEN_V1_CONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseBalanceOfProps {
  address: Address | undefined;
}

export default function useBalanceOf({ address }: UseBalanceOfProps) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: LP_TOKEN_V1_CONTRACT_ADDRESS,
    abi: LpTokenV1Abi,
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
