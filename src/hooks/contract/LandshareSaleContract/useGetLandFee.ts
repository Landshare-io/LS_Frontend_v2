import { useReadContract } from "wagmi";
import LandshareSaleAbi from "../../../abis/LandshareSale.json";
import { LANDSHARE_SALE_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { BigNumberish } from "ethers";

export default function useGetLandFee(chainId: number, usdcAmount: BigNumberish) {
  const { data, isError, isLoading, error } = useReadContract({
    address: LANDSHARE_SALE_CONTRACT_ADDRESS[chainId],
    abi: LandshareSaleAbi,
    functionName: "getLANDFee",
    chainId: chainId,
    args: [usdcAmount],
  })

  if (isLoading) return false
  if (isError) {
    console.log('Fetching LandshareSaleContract useGetLandFee error', error)
    return false
  }

  return data
}
