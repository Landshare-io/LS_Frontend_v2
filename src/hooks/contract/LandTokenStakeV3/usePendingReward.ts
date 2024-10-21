import { useReadContract } from "wagmi";
import { Address } from "viem";
import { bsc } from "viem/chains";
import LandStakingV3 from '../../../abis/LandStakingV3.json';
import { LAND_TOKEN_STAKE_V3_CONTRACT_ADDRESS } from "../../../config/constants/environments";

interface usePendingRewardProps {
  address: Address | undefined
}

export default function usePendingReward({ address }: usePendingRewardProps) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: LAND_TOKEN_STAKE_V3_CONTRACT_ADDRESS,
    abi: LandStakingV3,
    functionName: "pendingReward",
    args: [address],
    chainId: bsc.id
  })

  if (typeof address == 'undefined') return { data: 0, refetch, isLoading }
  if (isLoading) return { data: 0, refetch, isLoading }
  if (isError) {
    console.log('Fetching LandTokenStakeV2 userInfo error', error)
    return { data: 0, refetch, isLoading: false }
  }

  return { data, refetch, isLoading }
}
