import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEFCONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function usePoolInfo() {
  const { data } = useReadContract({
    address: MASTERCHEFCONTRACT_ADDRESS,
    abi: MasterchefAbi,
    functionName: "userInfo",
    args: [0],
    chainId: bsc.id
  })

  return data
}
