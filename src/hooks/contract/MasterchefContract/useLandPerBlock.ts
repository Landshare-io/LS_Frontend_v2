import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useLandPerBlock(chainId: number) {
  const { data, isError, isLoading, error } = useReadContract({
    address: MASTERCHEF_CONTRACT_ADDRESS[bsc.id],
    abi: MasterchefAbi,
    functionName: "landPerBlock",
    chainId: chainId
  })

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching MasterchefContract landPerBlock error', error)
    return 0
  }

  return data
}
