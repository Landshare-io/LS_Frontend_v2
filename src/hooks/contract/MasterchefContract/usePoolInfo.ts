import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function usePoolInfo(chainId: number, poolInfoArg: number) {
  const { data, isError, isLoading, error } = useReadContract({
    address: MASTERCHEF_CONTRACT_ADDRESS[bsc.id],
    abi: MasterchefAbi,
    functionName: "poolInfo",
    args: [poolInfoArg],
    chainId: bsc.id
  })

  if (isLoading) return { data: ['', 0, 0, 0], isLoading, error }
  if (isError) {
    console.log('Fetching MasterchefContract poolInfo error', error)
    return { data: ['', 0, 0, 0], isLoading, error }
  }

  return { data, isLoading, error }
}
