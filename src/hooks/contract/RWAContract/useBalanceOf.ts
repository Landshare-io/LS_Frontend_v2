import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import RwaContractAbi from "../../../abis/RWAContract.json";
import { RWA_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { Address } from "viem";

export default function useBalanceOf(address: Address | undefined) {
  if (typeof address == 'undefined') return 0

  const { data, isError, isLoading, error } = useReadContract({
    address: RWA_CONTRACT_ADDRESS,
    abi: RwaContractAbi,
    functionName: "balanceOf",
    chainId: bsc.id,
    args: []
  })

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching RWAContract balanceOf error', error)
    return 0
  }

  return data
}
