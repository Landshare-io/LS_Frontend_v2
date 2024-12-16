import { useReadContract } from "wagmi";
import { Address } from "viem";
import { bsc } from "viem/chains";
import LandLPFarm from '../../../abis/LandLPFarm.json';
import { LP_FARM_CONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseUserInfoProps {
  address: Address | undefined
}

export default function useUserInfo({ address }: UseUserInfoProps) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: LP_FARM_CONTRACT_ADDRESS,
    abi: LandLPFarm,
    functionName: "_userInfo",
    args: [address],
    chainId: bsc.id
  })

  if (typeof address == 'undefined') return { data: [0, 0], refetch, isLoading }
  if (isLoading) return { data: [0, 0], refetch, isLoading }
  if (isError) {
    console.log('Fetching LandLPFarm userInfo error', error)
    return { data: [0, 0], refetch, isLoading: false }
  }

  return { data, refetch, isLoading }
}
