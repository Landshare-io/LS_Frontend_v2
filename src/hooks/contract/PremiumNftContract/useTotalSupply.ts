import { useReadContract } from "wagmi";
import { Address } from "viem";
import PremiumNftAbi from '../../../abis/PremiumNft.json';


export default function useTotalSupply(chainId: number, contractAddress: Address) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: PremiumNftAbi,
    functionName: "totalSupply",
    chainId: chainId,
    args: []
  })

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching PremiumNft totalSupply error', error)
    return 0
  }

  return {
    data,
    refetch
  }
}
