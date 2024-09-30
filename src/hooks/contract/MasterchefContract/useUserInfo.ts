import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import { Address } from "viem";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseUserInfoProps {
  address: Address | undefined
}

export default function useUserInfo({ address }: UseUserInfoProps) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: MASTERCHEF_CONTRACT_ADDRESS,
    abi: MasterchefAbi,
    functionName: "userInfo",
    args: [0, address],
    chainId: bsc.id
  })

  if (isLoading) return { data: [0, 0], refetch }
  if (isError) {
    console.log('Fetching MasterchefContract userInfo error', error)
    return { data: [0, 0], refetch }
  }

  return { data, refetch }
}
