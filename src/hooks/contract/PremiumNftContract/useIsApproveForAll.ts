import { useReadContract } from 'wagmi'
import { Address } from 'viem';
import PremiumNft from "../../../abis/PremiumNft.json";
import { ADMIN_WALLET_ADDRESS } from "../../../config/constants/environments";

export default function useIsApprovedForAll(chainId: number, contractAddress: Address, address: Address | undefined) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: PremiumNft,
    functionName: "isApprovedForAll",
    args: [address, ADMIN_WALLET_ADDRESS],
    chainId: chainId
  })

  if (isLoading) return { data: false, refetch, isLoading }
  if (isError) {
    console.log('Fetching premiumNft isApprovedForAll error', error)
    return { data: false, refetch, isLoading: false }
  }

  return { data, refetch, isLoading }
}
