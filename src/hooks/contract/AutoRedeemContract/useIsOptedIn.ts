import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import type { Address } from "viem";
import AutoRedeemAbi from "../../../abis/AutoRedeem.json";
import { AUTOREDEEMCONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useIsOptedIn(address: Address | undefined) {
  if (typeof address == "undefined") return false
  const { data, isError, isLoading, error } = useReadContract({
    address: AUTOREDEEMCONTRACT_ADDRESS,
    abi: AutoRedeemAbi,
    functionName: "isOptedIn",
    chainId: bsc.id,
    args: [address],
  })

  if (isLoading) return false
  if (isError) {
    console.log('Fetching AutoRedeemContract useIsOptedIn error', error)
    return false
  }

  return data
}
