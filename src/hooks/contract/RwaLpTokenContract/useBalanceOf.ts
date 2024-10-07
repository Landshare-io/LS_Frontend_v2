import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import RwaLpContractAbi from "../../../abis/RwaLpContract.json";
import { RWA_LP_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { Address } from "viem";

export default function useBalanceOf(chainId: number, address: Address | undefined) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: RWA_LP_CONTRACT_ADDRESS[bsc.id],
    abi: RwaLpContractAbi,
    functionName: "balanceOf",
    chainId: chainId,
    args: [address]
  })

  if (typeof address == 'undefined') return { data: 0, refetch }
  if (isLoading) return { data: 0, refetch }
  if (isError) {
    console.log('Fetching RWAContract balanceOf error', error)
    return { data: 0, refetch }
  }

  return { data, refetch }
}
