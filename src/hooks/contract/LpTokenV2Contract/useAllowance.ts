import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import LpTokenV2Abi from "../../../abis/LpTokenV2.json";
import { LPTOKENV2CONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseBalanceOfProps {
  approver: string;
  to: string;
}

export default function useAllowance({ approver, to }: UseBalanceOfProps) {
  const { data } = useReadContract({
    address: LPTOKENV2CONTRACT_ADDRESS,
    abi: LpTokenV2Abi,
    functionName: "balanceOf",
    chainId: bsc.id,
    args: [approver, to]
  })

  return data
}
