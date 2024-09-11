import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEFCONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseUserInfoProps {
  address: string
}

export default function useUserInfo({ address }: UseUserInfoProps) {
  const { data } = useReadContract({
    address: MASTERCHEFCONTRACT_ADDRESS,
    abi: MasterchefAbi,
    functionName: "userInfo",
    args: [0, address],
    chainId: bsc.id
  })

  return data
}
