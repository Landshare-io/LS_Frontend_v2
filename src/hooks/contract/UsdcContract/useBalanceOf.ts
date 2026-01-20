import { useReadContract } from "wagmi";
import UsdcAbi from "../../../abis/USDC.json";
import { USDC_ADDRESS } from "../../../config/constants/environments";
import { Address } from "viem";

export default function useBalanceOf(chainId: number, address: Address | undefined) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: USDC_ADDRESS[chainId],
    abi: UsdcAbi,
    functionName: "balanceOf",
    chainId: chainId,
    args: [address]
  })

  if (typeof address == 'undefined') return { data: 0, refetch, isLoading }
  if (isLoading) return { data: 0, refetch }
  if (isError) {
    console.log('Fetching USDC balanceOf error', error)
    return { data: 0, refetch, isLoading }
  }

  return { data, refetch, isLoading }
}
