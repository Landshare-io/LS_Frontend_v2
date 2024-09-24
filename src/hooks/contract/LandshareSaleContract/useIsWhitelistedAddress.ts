import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import LandshareSaleAbi from "../../../abis/LandshareSale.json";
import { LANDSHARE_SALE_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { Address } from "viem";

export default function useIsWhitelistedAddress(address: Address | undefined) {
  const { data, isError, isLoading, error } = useReadContract({
    address: LANDSHARE_SALE_CONTRACT_ADDRESS,
    abi: LandshareSaleAbi,
    functionName: "isWhitelistedAddress",
    chainId: bsc.id,
    args: [address]
  })

  if (isLoading) return false
  if (isError) {
    console.log('Fetching LandshareSaleContract isWhitelistedAddress error', error)
    return false
  }

  return data
}
