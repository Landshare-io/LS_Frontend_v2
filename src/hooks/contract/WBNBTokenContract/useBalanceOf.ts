import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import WBNBAbi from '../../../abis/WBNB.json';
import { WBNBTOKENCONTRACT_ADDRESS } from "../../../config/constants/environments";

interface UseBalanceOfProps {
  address: string;
}

export default function useBalanceOf({ address }: UseBalanceOfProps) {
  const { data } = useReadContract({
    address: WBNBTOKENCONTRACT_ADDRESS,
    abi: WBNBAbi,
    functionName: "balanceOf",
    chainId: bsc.id,
    args: [address]
  })

  return data
}
