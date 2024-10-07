import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import PancakePairAbi from '../../../abis/PancakePair.json';
import { PANCAKE_PAIR_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useGetReserves(chainId: number) {
  const { data, isError, isLoading, error } = useReadContract({
    address: PANCAKE_PAIR_CONTRACT_ADDRESS[bsc.id],
    abi: PancakePairAbi,
    functionName: "getReserves",
    chainId: chainId
  })

  if (isLoading) return [0, 0]
  if (isError) {
    console.log('Fetching PancakePairContract userInfo error', error)
    return [0, 0]
  }

  return data
}
