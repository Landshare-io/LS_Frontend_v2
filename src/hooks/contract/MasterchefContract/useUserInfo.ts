import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEFCONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseUserInfoProps {
  address: string
}

export default function useUserInfo({ address }: UseUserInfoProps) {
  const { data, isError, isLoading, error } = useReadContract({
    address: MASTERCHEFCONTRACT_ADDRESS,
    abi: MasterchefAbi,
    functionName: "userInfo",
    args: [0, address],
    chainId: bsc.id
  })

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching MasterchefContract userInfo error', error)
    return 0
  }

  return data
}
