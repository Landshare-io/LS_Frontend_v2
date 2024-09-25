import { useReadContract } from "wagmi";
import usdcAbi from "../../../abis/USDC.json";
import { USDC_ADDRESS } from "../../../config/constants/environments";
import { Address } from "viem";

export default function useAllowance(chainId: number, address: Address | undefined, spender: Address | undefined) {
  const { data, isError, isLoading, error } = useReadContract({
    address: USDC_ADDRESS[chainId ?? 56],
    abi: usdcAbi,
    functionName: "allowance",
    chainId: chainId ?? 56,
    args: [address, spender]
  })

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching UsdcContract allowance error', error)
    return 0
  }

  return data
}
