import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useTotalAllocPoint() {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: MASTERCHEF_CONTRACT_ADDRESS[bsc.id],
    abi: MasterchefAbi,
    functionName: "totalAllocPoint",
    chainId: bsc.id
  })

  if (isLoading) return { data: 0, refetch, isLoading }
  if (isError) {
    console.log('Fetching MasterchefContract totalAllocPoint error', error)
    return { data: 0, refetch, isLoading: false }
  }

  return { data, refetch, isLoading }
}
