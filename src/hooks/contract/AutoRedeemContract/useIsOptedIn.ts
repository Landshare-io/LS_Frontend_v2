import { useReadContract } from "wagmi";
import type { Address } from "viem";
import AutoRedeemAbi from "../../../abis/AutoRedeem.json";
import { AUTO_REDEEM_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useIsOptedIn(chainId: number, address: Address | undefined) {
  const { data, isError, isLoading, error } = useReadContract({
    address: AUTO_REDEEM_CONTRACT_ADDRESS[chainId],
    abi: AutoRedeemAbi,
    functionName: "isOptedIn",
    args: [address],
    chainId: chainId
  })

  if (typeof address == 'undefined') return false
  if (isLoading) return false
  if (isError) {
    console.log('Fetching AutoRedeemContract useIsOptedIn error', error)
    return false
  }

  return data
}
