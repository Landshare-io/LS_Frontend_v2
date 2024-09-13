import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import LpTokenV2Abi from "../../../abis/LpTokenV2.json";
import { LPTOKENV2CONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseBalanceOfProps {
  approver: string;
  to: string;
}

export default function useAllowance({ approver, to }: UseBalanceOfProps) {
  const { data, isError, isLoading, error } = useReadContract({
    address: LPTOKENV2CONTRACT_ADDRESS,
    abi: LpTokenV2Abi,
    functionName: "allowance",
    chainId: bsc.id,
    args: [approver, to]
  })

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching LpTokenV2Contract allowance error', error)
    return 0
  }

  return data
}
