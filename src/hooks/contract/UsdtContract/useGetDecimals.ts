import { useReadContract } from "wagmi";
import UsdtAbi from "../../../abis/USDT.json";
import { USDT_ADDRESS } from "../../../config/constants/environments";
import { Address } from "viem";

export default function useGetDecimals(chainId: number) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: USDT_ADDRESS[chainId],
    abi: UsdtAbi,
    functionName: "decimals",
    chainId: chainId,
  })

  if (isLoading) return { data: 18, refetch }
  if (isError) {
    console.log('Fetching RWAContract balanceOf error', error)
    return { data: 18, refetch, isLoading }
  }

  return { data, refetch, isLoading }
}
