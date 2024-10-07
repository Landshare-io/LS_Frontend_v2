import { useReadContract } from "wagmi";
import { Address } from "viem";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UsePendingLandProps {
  chainId: number
  pendingLandId: number
  address: Address | undefined
}

export default function usePendingLand({ chainId, pendingLandId, address }: UsePendingLandProps) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: MASTERCHEF_CONTRACT_ADDRESS[chainId],
    abi: MasterchefAbi,
    functionName: "pendingLand",
    args: [pendingLandId, address],
    chainId: chainId
  })

  if (typeof address == 'undefined') return { data: 0, refetch, isLoading }
  if (isLoading) return { data: 0, refetch, isLoading }
  if (isError) {
    console.log('Fetching MasterchefContract pendingLand error', error)
    return { data: 0, refetch, isLoading: false }
  }

  return { data, refetch, isLoading }
}
