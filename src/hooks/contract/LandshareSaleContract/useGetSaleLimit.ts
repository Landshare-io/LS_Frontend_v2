import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import LandshareSaleAbi from "../../../abis/LandshareSale.json";
import { LANDSHARE_SALE_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { Address } from "viem";

export default function useGetSaleLimit(address: Address) {
  const { data, isError, isLoading, error } = useReadContract({
    address: LANDSHARE_SALE_CONTRACT_ADDRESS,
    abi: LandshareSaleAbi,
    functionName: "getSaleLimit",
    chainId: bsc.id,
    args: [address]
  })

  if (isLoading) return [0, 0, 0]
  if (isError) {
    console.log('Fetching LandshareSaleContract getSaleLimit error', error)
    return [0, 0, 0]
  }

  return data
}
