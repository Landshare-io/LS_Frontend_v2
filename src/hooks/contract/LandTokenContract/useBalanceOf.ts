import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import LpTokenV2Abi from "../../../abis/LpTokenV2.json";
import { LANDTOKENCONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseBalanceOfProps {
  chainId: 56 | 97 | 1 | 11155111 | 137 | 80002 | 42161 | 421614;
  address: string;
}

export default function useBalanceOf({ chainId, address }: UseBalanceOfProps) {
  const { data } = useReadContract({
    address: LANDTOKENCONTRACT_ADDRESS[chainId],
    abi: LpTokenV2Abi,
    functionName: "balanceOf",
    chainId: chainId,
    args: [address]
  })

  return data
}
