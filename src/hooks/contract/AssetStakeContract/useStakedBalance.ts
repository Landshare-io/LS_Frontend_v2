import { useReadContract } from "wagmi";
import { Address } from "viem";
import AssetStake from "../../../abis/AssetStake.json"
import { ASSET_STAKE_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useStakedBalance(chainId: number, address: Address | undefined) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: ASSET_STAKE_CONTRACT_ADDRESS[chainId],
    abi: AssetStake,
    functionName: "stakedBalance",
    args: [address],
    chainId: chainId
  })

  if (isLoading) return { data: 0, refetch, isLoading }
  if (isError) {
    console.log('Fetching autoVaultv1 getting totalShares error', error)
    return { data: 0, refetch, isLoading: false }
  }

  return { data, refetch, isLoading }
}
