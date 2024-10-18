import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import AutoVaultContract from "../../../abis/AutoLandVault.json"
import { AUTO_LAND_V1_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useTotalShares() {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: AUTO_LAND_V1_CONTRACT_ADDRESS,
    abi: AutoVaultContract,
    functionName: "totalShares",
    args: [],
    chainId: bsc.id
  })

  if (isLoading) return { data: 0, refetch, isLoading }
  if (isError) {
    console.log('Fetching autoVaultv1 getting totalShares error', error)
    return { data: 0, refetch, isLoading: false }
  }

  return { data, refetch, isLoading }
}
