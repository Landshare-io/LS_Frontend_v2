import { useReadContract } from 'wagmi'
import { Address } from 'viem';
import { bsc } from 'viem/chains';
import HouseNft from "../../../abis/HouseNft.json";
import { HOUSE_NFT_CONTRACT, ADMIN_WALLET_ADDRESS } from "../../../config/constants/environments";

export default function useIsApprovedForAll(chainId: number, address: Address | undefined) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: HOUSE_NFT_CONTRACT[chainId],
    abi: HouseNft,
    functionName: "isApprovedForAll",
    args: [address, ADMIN_WALLET_ADDRESS[chainId]],
    chainId: chainId
  })

  if (isLoading) return { data: false, refetch, isLoading }
  if (isError) {
    console.log('Fetching HouseNft isApprovedForAll error', error)
    return { data: false, refetch, isLoading: false }
  }

  return { data, refetch, isLoading }
}
