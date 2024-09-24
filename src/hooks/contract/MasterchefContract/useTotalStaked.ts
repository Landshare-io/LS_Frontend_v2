import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import MasterchefAbi from '../../../abis/Masterchef.json';
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useTotalStaked() {
  const { data, isError, isLoading, error } = useReadContract({
    address: MASTERCHEF_CONTRACT_ADDRESS,
    abi: MasterchefAbi,
    functionName: "totalStaked",
    chainId: bsc.id
  })

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching MasterchefContract totalStaked error', error)
    return 0
  }

  return data
}
