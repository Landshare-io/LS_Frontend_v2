import { useReadContract } from "wagmi";
import { Address } from "viem";
import PremiumNftAbi from '../../../abis/PremiumNft.json';
import { PORCELAIN_TILE_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useGetItemsByOwner(chainId: number, address: Address | undefined) {
  const { data, isError, isLoading, error } = useReadContract({
    address: PORCELAIN_TILE_CONTRACT_ADDRESS[chainId],
    abi: PremiumNftAbi,
    functionName: "getItemsByOwner",
    chainId: chainId,
    args: [address]
  })

  if (isLoading) return []
  if (isError) {
    console.log('Fetching PorcelainTile getItemsByOwner error', error)
    return []
  }

  return data
}
