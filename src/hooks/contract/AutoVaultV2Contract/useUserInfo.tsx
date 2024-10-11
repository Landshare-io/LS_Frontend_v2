import { useReadContract } from "wagmi";
import { Address } from "viem";
import { bsc } from "viem/chains";
import AutoVaultV2Contract from "../../../abis/AutoVaultV2.json"
import { AUTO_VAULT_V3_CONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseUserInfoProps {
  chainId: number
  address: Address | undefined
}

export default function useUserInfo({ chainId, address }: UseUserInfoProps) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: AUTO_VAULT_V3_CONTRACT_ADDRESS[bsc.id],
    abi: AutoVaultV2Contract,
    functionName: "userInfo",
    args: [address],
    chainId: bsc.id
  })

  if (typeof address == 'undefined') return { data: [0, 0, 0, 0], refetch, isLoading }
  if (isLoading) return { data: [0, 0, 0, 0], refetch, isLoading }
  if (isError) {
    console.log('Fetching autoVaultv3 userInfo error', error)
    return { data: [0, 0, 0, 0], refetch, isLoading: false }
  }

  return { data, refetch, isLoading }
}
