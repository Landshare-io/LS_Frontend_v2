import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import RwaContractAbi from "../../../abis/RWAContract.json";
import { RWA_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { Address } from "viem";

export default function useIsWhitelistedAddress(chainId: number, address: Address | undefined) {
  const { data, isError, isLoading, error } = useReadContract({
    address: RWA_CONTRACT_ADDRESS[bsc.id],
    abi: RwaContractAbi,
    functionName: "isWhitelistedAddress",
    chainId: bsc.id,
    args: [address]
  })

  if (typeof address == 'undefined') return false
  if (isLoading) return false
  if (isError) {
    console.log('Fetching RWAContract isWhitelistedAddress error', error)
    return false
  }

  return data
}
