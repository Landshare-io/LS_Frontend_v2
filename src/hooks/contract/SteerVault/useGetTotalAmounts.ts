import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import SteerVaultAbi from "../../../abis/SteerVault.json";
import { Address } from "viem";

export default function useGetTotalAmounts(vaultAddress: Address | undefined) {
  const { data, isError, isLoading, error } = useReadContract({
    address: vaultAddress,
    abi: SteerVaultAbi,
    functionName: "getTotalAmounts",
    chainId: bsc.id
  })

  if (!vaultAddress) return { data: [0n, 0n] as readonly [bigint, bigint], isLoading: false }
  if (isLoading) return { data: [0n, 0n] as readonly [bigint, bigint], isLoading }
  if (isError) {
    console.log('Fetching SteerVault getTotalAmounts error', error)
    return { data: [0n, 0n] as readonly [bigint, bigint], isLoading }
  }

  return { data: data as readonly [bigint, bigint], isLoading }
}
