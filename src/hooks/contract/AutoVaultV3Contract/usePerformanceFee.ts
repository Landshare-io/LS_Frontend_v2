import { useReadContract } from "wagmi";
import { Address } from "viem";
import { bsc } from "viem/chains";
import AutoVaultV3Contract from "../../../abis/AutoVaultV3.json"
import { AUTO_VAULT_V3_CONTRACT_ADDRESS } from "../../../config/constants/environments";


export default function usePerformanceFee( chainId: number) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: AUTO_VAULT_V3_CONTRACT_ADDRESS[bsc.id],
    abi: AutoVaultV3Contract,
    functionName: "performanceFee",
    args: [],
    chainId: bsc.id
  })

  if (isLoading) return { data: 0, refetch, isLoading }
  if (isError) {
    console.log('Fetching autoVaultv3 userInfo error', error)
    return { data: 0, refetch, isLoading: false }
  }

  return { data, refetch, isLoading }
}
