import { useReadContract } from "wagmi";
import { parseUnits } from "ethers";
import { bsc } from "viem/chains";
import LandshareSaleAbi from "../../../abis/LandshareSale.json";
import { LANDSHARE_SALE_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useGetLandFee(chainId: number, usdcAmount: number) {
  const { data, isError, isLoading, error } = useReadContract({
    address: LANDSHARE_SALE_CONTRACT_ADDRESS[chainId],
    abi: LandshareSaleAbi,
    functionName: "getLANDFee",
    chainId: chainId,
    args: [parseUnits(usdcAmount.toString())],
  })

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching LandshareSaleContract useGetLandFee error', error)
    return 0
  }

  return data
}
