import { useReadContract } from "wagmi";
import { Address } from "viem";
import PremiumNftAbi from '../../../abis/PremiumNft.json';

export default function useGetItemsByOwner(chainId: number, contractAddress: Address, address: Address | undefined) {
  const { data, isError, isLoading, error } = useReadContract({
    address: contractAddress,
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
