import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import tokenContractAbi from "@/abis/ERC20.json";
import { Address } from "viem";

export default function useTokenBalance(chainId: number | undefined, address: Address | undefined, token: Address | undefined) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: token,
    abi: tokenContractAbi,
    functionName: "balanceOf",
    chainId: chainId,
    args: [address]
  })

  console.log('contract data => ', data, isError,isLoading,error)

  if (typeof address == 'undefined') return { data: 0, refetch, isLoading }
  if (isLoading) return { data: 0, refetch, isLoading }
  if (isError) {
    console.log('Fetching RWAContract balanceOf error', error)
    return { data: 0, refetch, isLoading }
  }

  return { data, refetch, isLoading }
}
