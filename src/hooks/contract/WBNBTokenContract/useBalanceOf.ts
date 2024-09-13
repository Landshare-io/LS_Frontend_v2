import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import WBNBAbi from '../../../abis/WBNB.json';
import { WBNBTOKENCONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseBalanceOfProps {
  address: string;
}

export default function useBalanceOf({ address }: UseBalanceOfProps) {
  const { data, isError, isLoading, error } = useReadContract({
    address: WBNBTOKENCONTRACT_ADDRESS,
    abi: WBNBAbi,
    functionName: "balanceOf",
    chainId: bsc.id,
    args: [address]
  })

  if (isLoading) return 0
  if (isError) {
    console.log('Fetching WBNBTokenContract balanceOf error', error)
    return 0
  }

  return data
}
