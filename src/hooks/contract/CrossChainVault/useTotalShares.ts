import { useReadContract } from "wagmi";
import AutoVaultV2Contract from "../../../abis/AutoVaultV2.json"
import { CCIP_CHAIN_VAULT_ADDRESS } from "../../../config/constants/environments";

export default function useTotalShares(chainId: number) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: CCIP_CHAIN_VAULT_ADDRESS[chainId],
    abi: AutoVaultV2Contract,
    functionName: "totalShares",
    args: [],
    chainId: chainId
  })

  if (isLoading) return { data: 0, refetch, isLoading }
  if (isError) {
    console.log('Fetching cross chain vault getting Total share error', error)
    return { data: 0, refetch, isLoading: false }
  }

  return { data, refetch, isLoading }
}
