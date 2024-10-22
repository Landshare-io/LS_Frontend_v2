import { useReadContract } from "wagmi";
import { Address } from "viem";
import LpTokenV2Abi from "../../abis/LpTokenV2.json";

export default function useCheckAllowance(address: Address | undefined, erc20Address: Address | undefined, spender: Address | undefined) {
  const { data: balance, isError: isBalanceError, isLoading: balanceLoading, refetch: balanceRefetch, error: balanceError } = useReadContract({
    address: erc20Address,
    abi: LpTokenV2Abi,
    functionName: "balanceOf",
    args: [address],
  }) as any

  const { data: allowanceAmount, isError: isAllowanceError, isLoading: allowanceLoading, refetch: allowanceRefetch, error: allowanceError } = useReadContract({
    address: erc20Address,
    abi: LpTokenV2Abi,
    functionName: "allowance",
    args: [address, spender],
  }) as any;

  const refetch = async () => {
    await balanceRefetch()
    await allowanceRefetch()
  }

  if (balanceLoading || allowanceLoading) return { data: false, refetch }
  if (isBalanceError || isAllowanceError) return { data: false, refetch }

  return {
    data: allowanceAmount >= balance,
    refetch
  }
}
