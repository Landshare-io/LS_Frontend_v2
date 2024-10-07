import { useReadContract } from "wagmi";
import { Address } from "viem";
import { bsc } from "viem/chains";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseUserInfoProps {
  chainId: number
  userInfoId: number
  address: Address | undefined
}

export default function useUserInfo({ chainId, userInfoId, address }: UseUserInfoProps) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: MASTERCHEF_CONTRACT_ADDRESS[bsc.id],
    abi: MasterchefAbi,
    functionName: "userInfo",
    args: [userInfoId, address],
    chainId: chainId
  })

  if (typeof address == 'undefined') return { data: [0, 0], refetch, isLoading }
  if (isLoading) return { data: [0, 0], refetch, isLoading }
  if (isError) {
    console.log('Fetching MasterchefContract userInfo error', error)
    return { data: [0, 0], refetch, isLoading: false }
  }

  return { data, refetch, isLoading }
}
