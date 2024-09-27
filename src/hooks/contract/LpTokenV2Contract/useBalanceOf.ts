import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import { Address } from "viem";
import LpTokenV2Abi from "../../../abis/LpTokenV2.json";
import { LP_TOKEN_V2_CONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseBalanceOfProps {
  address: Address | undefined;
}

export default function useBalanceOf({ address }: UseBalanceOfProps) {
  const { data, isError, isLoading, error } = useReadContract({
    address: LP_TOKEN_V2_CONTRACT_ADDRESS,
    abi: LpTokenV2Abi,
    functionName: "balanceOf",
    chainId: bsc.id,
    args: [address]
  })

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching LpTokenV2Contract balanceOf error', error)
    return 0
  }

  return data
}
