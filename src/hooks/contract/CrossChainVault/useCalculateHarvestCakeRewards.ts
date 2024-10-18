import { useReadContract } from "wagmi";
import AutoVaultV3Contract from "../../../abis/AutoVaultV3.json"
import { CCIP_CHAIN_VAULT_ADDRESS } from "../../../config/constants/environments";

export default function useCalculateHarvestCakeRewards(chainId: number) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: CCIP_CHAIN_VAULT_ADDRESS[chainId],
    abi: AutoVaultV3Contract,
    functionName: "calculateHarvestCakeRewards",
    args: [],
    chainId: chainId
  })

  if (isLoading) return { data: 0, refetch, isLoading }
  if (isError) {
    console.log('Fetching cross chain vault getting calculateHarvestCakeRewards error', error)
    return { data: 0, refetch, isLoading: false }
  }

  return { data, refetch, isLoading }
}
