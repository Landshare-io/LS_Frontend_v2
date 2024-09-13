import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import BNBApePair from "../../../abis/BNBApePair.json";
import { BNBAPEPAIRCONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useGetReserves() {
  const { data, isError, isLoading, error } = useReadContract({
    address: BNBAPEPAIRCONTRACT_ADDRESS,
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
