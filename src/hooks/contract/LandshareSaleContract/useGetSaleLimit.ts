import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import LandshareSaleAbi from "../../../abis/LandshareSale.json";
import { LANDSHARE_SALE_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { Address } from "viem";

export default function useGetSaleLimit(chainId: number, address: Address | undefined) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: LANDSHARE_SALE_CONTRACT_ADDRESS[chainId],
    abi: LandshareSaleAbi,
    functionName: "getSaleLimit",
    chainId: chainId,
    args: [address]
  })

  if (typeof address == 'undefined') return { data: [0, 0, 0], refetch, isLoading }
  if (isLoading) return {
    data: [0, 0, 0],
    refetch, 
    isLoading
  }
  if (isError) {
    console.log('Fetching LandshareSaleContract getSaleLimit error', error)
    return {
      data: [0, 0, 0],
      refetch, 
      isLoading
    }
  }

  return { data, refetch }
}
