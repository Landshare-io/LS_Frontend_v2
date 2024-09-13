import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import PancakePairAbi from '../../../abis/PancakePair.json';
import { PANCAKEPAIRCONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useGetReserves() {
  const { data, isError, isLoading, error } = useReadContract({
    address: PANCAKEPAIRCONTRACT_ADDRESS,
    abi: PancakePairAbi,
    functionName: "getReserves",
    chainId: bsc.id
  })

  if (isLoading) return [0, 0]
  if (isError) {
    console.log('Fetching PancakePairContract userInfo error', error)
    return [0, 0]
  }

  return data
}
