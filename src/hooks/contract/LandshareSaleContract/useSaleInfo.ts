import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import LandshareSaleAbi from "../../../abis/LandshareSale.json";
import { LANDSHARE_SALE_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { Address } from "viem";

export default function useSaleInfo(chainId: number, address: Address | undefined) {
  const { data, isError, isLoading, error } = useReadContract({
    address: LANDSHARE_SALE_CONTRACT_ADDRESS[bsc.id],
    abi: LandshareSaleAbi,
    functionName: "saleInfo",
    chainId: chainId,
    args: [address]
  })

  if (typeof address == 'undefined') return [0, 0]
  if (isLoading) return [0, 0]
  if (isError) {
    console.log('Fetching LandshareSaleContract saleInfo error', error)
    return [0, 0]
  }

  return data
}
