import { useReadContract } from "wagmi";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function usePoolInfo(chainId: number, poolInfoArg: number) {
  const { data, isError, isLoading, error } = useReadContract({
    address: MASTERCHEF_CONTRACT_ADDRESS[chainId],
    abi: MasterchefAbi,
    functionName: "poolInfo",
    args: [poolInfoArg],
    chainId: chainId
  })

  if (isLoading) return [0, 0]
  if (isError) {
    console.log('Fetching MasterchefContract poolInfo error', error)
    return 0
  }

  return data
}
