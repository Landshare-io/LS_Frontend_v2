import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import LandshareSaleAbi from "../../../abis/LandshareSale.json";
import { LANDSHARE_SALE_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useLandFee(chainId: number) {
  const { data, isError, isLoading, error } = useReadContract({
    address: LANDSHARE_SALE_CONTRACT_ADDRESS[bsc.id],
    abi: LandshareSaleAbi,
    functionName: "landFee",
    chainId: bsc.id
  })

  if (isLoading) return false
  if (isError) {
    console.log('Fetching LandshareSaleContract useLandFee error', error)
    return false
  }

  return data
}
