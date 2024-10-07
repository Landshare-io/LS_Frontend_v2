import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import { Address } from "viem";
import LpTokenV2Abi from "../../../abis/LpTokenV2.json";
import { LP_TOKEN_V2_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useAllowance(chainId: number, approver: Address | undefined, to: Address) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: LP_TOKEN_V2_CONTRACT_ADDRESS[chainId],
    abi: LpTokenV2Abi,
    functionName: "allowance",
    chainId: bsc.id,
    args: [approver, to]
  })

  if (isLoading) return { data: 0, refetch }
  if (isError) {
    console.log('Fetching LpTokenV2Contract allowance error', error)
    return { data: 0, refetch }
  }

  return { data, refetch }
}
