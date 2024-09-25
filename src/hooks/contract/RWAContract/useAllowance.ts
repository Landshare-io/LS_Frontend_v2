import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import RwaContractAbi from "../../../abis/RWAContract.json";
import { RWA_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { Address } from "viem";

export default function useAllowance(address: Address | undefined, spender: Address | undefined) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: RWA_CONTRACT_ADDRESS,
    abi: RwaContractAbi,
    functionName: "allowance",
    chainId: bsc.id,
    args: [address, spender]
  })

  if (isLoading) return {
    data: 0,
    refetch
  }
  if (isError) {
    console.log('Fetching RWAContract allowance error', error)
    return {
      data: 0,
      refetch
    }
  }

  return { data, refetch }
}
