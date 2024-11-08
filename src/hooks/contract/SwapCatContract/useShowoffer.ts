import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import Swapcat from "../../../abis/Swapcat.json";
import { SWAPCAT_ADDRESS } from "../../../config/constants/environments";

export default function useShowOffer(id: any) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: SWAPCAT_ADDRESS,
    abi: Swapcat,
    functionName: "showoffer",
    chainId: bsc.id,
    args: [id]
  })

  if (isLoading) return { data: ['', '', '', 0, 0, 0], refetch }
  if (isError) {
    console.log('Fetching Swapcat Contract showoffer error', error)
    return { data: ['', '', '', 0, 0, 0], refetch }
  }

  return { data, refetch }
}
