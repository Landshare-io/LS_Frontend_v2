import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function usePoolInfo(poolInfoArg: Number) {
  const { data, isError, isLoading, error } = useReadContract({
    address: MASTERCHEF_CONTRACT_ADDRESS,
    abi: MasterchefAbi,
    functionName: "poolInfo",
    args: [poolInfoArg],
    chainId: bsc.id
  })

  if (isLoading) return [0, 0]
  if (isError) {
    console.log('Fetching MasterchefContract poolInfo error', error)
    return 0
  }

  return data
}
