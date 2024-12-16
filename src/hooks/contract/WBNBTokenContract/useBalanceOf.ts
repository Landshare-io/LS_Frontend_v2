import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import WBNBAbi from '../../../abis/WBNB.json';
import { WBNB_TOKEN_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { Address } from "viem";

interface UseBalanceOfProps {
  chainId: number
  address: Address | undefined;
}

export default function useBalanceOf({ chainId, address }: UseBalanceOfProps) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: WBNB_TOKEN_CONTRACT_ADDRESS[bsc.id],
    abi: WBNBAbi,
    functionName: "balanceOf",
    args: [address],
    chainId: bsc.id
  })

  if (isLoading) return { data: 0, refetch }
  if (isError) {
    console.log('Fetching WBNBTokenContract balanceOf error', error)
    return { data: 0, refetch }
  }

  return { data, refetch }
}
