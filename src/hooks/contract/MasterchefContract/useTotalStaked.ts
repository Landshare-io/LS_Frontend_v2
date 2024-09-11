import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEFCONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseTotalStakedProps {
  address: string
}

export default function useTotalStaked({ address }: UseTotalStakedProps) {
  const { data } = useReadContract({
    address: MASTERCHEFCONTRACT_ADDRESS,
    abi: MasterchefAbi,
    functionName: "totalStaked",
    args: [0, address],
    chainId: bsc.id
  })

  return data
}
