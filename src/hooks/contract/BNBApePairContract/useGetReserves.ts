import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import BNBApePair from "../../../abis/BNBApePair.json";
import { BNB_APE_PAIR_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useGetReserves(chainId: number) {
  const { data, isError, isLoading, error } = useReadContract({
    address: BNB_APE_PAIR_CONTRACT_ADDRESS[bsc.id],
    abi: BNBApePair,
    functionName: "getReserves",
    chainId: bsc.id
  })

  if (isLoading) return [0, 0]
  if (isError) {
    console.log('Fetching BNBApePairContract getReserves error', error)
    return [0, 0]
  }

  return data
}
