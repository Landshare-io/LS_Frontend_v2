import { useReadContract } from "wagmi";
import { Address } from "viem";
import AutoVaultV3Contract from "../../../abis/AutoVaultV3.json"
import { CCIP_CHAIN_VAULT_ADDRESS } from "../../../config/constants/environments";

export default function useUserInfo(chainId: number, address: Address | undefined) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: CCIP_CHAIN_VAULT_ADDRESS[chainId],
    abi: AutoVaultV3Contract,
    functionName: "userInfo",
    args: [address],
    chainId: chainId
  })

  if (typeof address == 'undefined') return { data: [0, 0, 0, 0], refetch, isLoading }
  if (isLoading) return { data: [0, 0, 0, 0], refetch, isLoading }
  if (isError) {
    console.log('Fetching cross chain vault getting userInfo error', error)
    return { data: [0, 0, 0, 0], refetch, isLoading: false }
  }

  return { data, refetch, isLoading }
}
