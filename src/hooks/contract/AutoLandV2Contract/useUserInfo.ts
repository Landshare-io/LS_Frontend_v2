import { useReadContract } from "wagmi";
import { Address } from "viem";
import { bsc } from "viem/chains";
import AutoLandVaultV2 from '../../../abis/AutoLandVaultV2.json';
import { AUTO_LAND_V2_CONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseUserInfoProps {
  address: Address | undefined
}

export default function useUserInfo({ address }: UseUserInfoProps) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: AUTO_LAND_V2_CONTRACT_ADDRESS,
    abi: AutoLandVaultV2,
    functionName: "userInfo",
    args: [address],
    chainId: bsc.id
  })

  if (typeof address == 'undefined') return { data: [0, 0, 0, 0], refetch, isLoading }
  if (isLoading) return { data: [0, 0, 0, 0], refetch, isLoading }
  if (isError) {
    console.log('Fetching AutoLandV2 userInfo error', error)
    return { data: [0, 0, 0, 0], refetch, isLoading: false }
  }

  return { data, refetch, isLoading }
}
