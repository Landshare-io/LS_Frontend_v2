import { useReadContract } from "wagmi";
import { Address } from "viem";
import { bsc } from "viem/chains";
import LANDV2Abi from "../../../abis/LANDV2.json";
import CcipBnLAbi from "../../../abis/CcipBnL.json";
import { LAND_TOKEN_CONTRACT_ADDRESS } from "../../../config/constants/environments";


interface UseBalanceOfProps {
  address: Address | undefined;
  chainId: number | undefined;
}

export default function useBalanceOf({ address, chainId }: UseBalanceOfProps) {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: LAND_TOKEN_CONTRACT_ADDRESS[chainId ?? 56],
    abi: chainId == 56 ? LANDV2Abi.abi : CcipBnLAbi,
    functionName: "balanceOf",
    chainId: bsc.id,
    args: [address]
  })

  if (typeof address == 'undefined') return { data: 0, isLoading, refetch }
  if (isLoading) return { data: 0, isLoading, refetch }
  if (isError) {
    console.log('Fetching LandTokenContract balanceOf error', error)
    return { data: 0, isLoading, refetch }
  }

  return { data, isLoading, refetch }
}
