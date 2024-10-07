import { useReadContract } from "wagmi";
import RwaContractAbi from "../../../abis/RWAContract.json";
import { RWA_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useTotalSupply(chainId: number) {
  const { data, isError, isLoading, error } = useReadContract({
    address: RWA_CONTRACT_ADDRESS[chainId],
    abi: RwaContractAbi,
    functionName: "totalSupply",
    chainId: chainId
  })

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching RWAContract totalSupply error', error)
    return 0
  }

  return data
}
