import { useReadContract } from "wagmi";
import { Address } from "viem";
import { bsc } from "viem/chains";
import LandStakingV3 from '../../../abis/LandStakingV3.json';
import { LAND_TOKEN_STAKE_V3_CONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseUserInfoProps {
  address: Address | undefined
}

export default function useUserInfo({ address }: UseUserInfoProps) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: LAND_TOKEN_STAKE_V3_CONTRACT_ADDRESS,
    abi: LandStakingV3,
    functionName: "userInfo",
    args: [address],
    chainId: bsc.id
  })

  if (typeof address == 'undefined') return { data: [0, 0], refetch, isLoading }
  if (isLoading) return { data: [0, 0], refetch, isLoading }
  if (isError) {
    console.log('Fetching LandTokenStakeV3 userInfo error', error)
    return { data: [0, 0], refetch, isLoading: false }
  }

  return { data, refetch, isLoading }
}
