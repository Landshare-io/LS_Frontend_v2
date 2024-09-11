import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEFCONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UsePendingLandProps {
  address: string
}

export default function usePendingLand({ address }: UsePendingLandProps) {
  const { data } = useReadContract({
    address: MASTERCHEFCONTRACT_ADDRESS,
    abi: MasterchefAbi,
    functionName: "pendingLand",
    args: [0, address],
    chainId: bsc.id
  })

  return data
}
