import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import { Address } from "viem";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UsePendingLandProps {
  pendingLandId: Number
  address: Address | undefined
}

export default function usePendingLand({ pendingLandId, address }: UsePendingLandProps) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: MASTERCHEF_CONTRACT_ADDRESS,
    abi: MasterchefAbi,
    functionName: "pendingLand",
    args: [0, address],
    chainId: bsc.id
  })

  if (isLoading) return { data: 0, refetch, isLoading }
  if (isError) {
    console.log('Fetching MasterchefContract pendingLand error', error)
    return { data: 0, refetch, isLoading: false }
  }

  return { data, refetch, isLoading }
}
