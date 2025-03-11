import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import RwaContractAbi from "../../../abis/RWAContract.json";
import { RWA_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { Address } from "viem";

export default function useIsWhitelistedAddress(chainId: number, address: Address | undefined) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: RWA_CONTRACT_ADDRESS[chainId],
    abi: RwaContractAbi,
    functionName: "isWhitelistedAddress",
    chainId: chainId,
    args: [address]
  })

  if (typeof address == 'undefined') return { refetch, data: false }
  if (isLoading) return { refetch, data: false }
  if (isError) {
    console.log('Fetching RWAContract isWhitelistedAddress error', error)
    return { refetch, data: false }
  }

  return { refetch, data }
}
