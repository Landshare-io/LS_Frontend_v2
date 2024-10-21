import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import { MASTERCHEF_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import MasterchefAbi from '../../../abis/Masterchef.json';

export default function useBalanceOf() {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: MASTERCHEF_CONTRACT_ADDRESS[bsc.id],
    abi: MasterchefAbi,
    functionName: "balanceOf",
    args: [],
    chainId: bsc.id
  })

  if (isLoading) return { data: 0, refetch, isLoading }
  if (isError) {
    console.log('Fetching autoVaultv2 getting balanceOf error', error)
    return { data: 0, refetch, isLoading: false }
  }

  return { data, refetch, isLoading }
}
