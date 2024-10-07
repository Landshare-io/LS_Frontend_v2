import { useReadContract } from "wagmi";
import RwaLpContractAbi from "../../../abis/RwaLpContract.json";
import { RWA_LP_CONTRACT_ADDRESS } from '../../../config/constants/environments';

export default function useTotalSupply(chainId: number) {
  const { data, isError, isLoading, error } = useReadContract({
    address: RWA_LP_CONTRACT_ADDRESS[chainId],
    abi: RwaLpContractAbi,
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
