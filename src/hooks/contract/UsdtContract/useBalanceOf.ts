import { useReadContract } from "wagmi";
import UsdtAbi from "../../../abis/USDT.json";
import { USDT_ADDRESS } from "../../../config/constants/environments";
import { Address } from "viem";

export default function useBalanceOf(chainId: number, address: Address | undefined) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: USDT_ADDRESS[chainId],
    abi: UsdtAbi,
    functionName: "balanceOf",
    chainId: chainId,
    args: [address]
  })

  if (typeof address == 'undefined') return { data: 0, refetch }
  if (isLoading) return { data: 0, refetch }
  if (isError) {
    console.log('Fetching RWAContract balanceOf error', error)
    return { data: 0, refetch }
  }

  return { data, refetch }
}
