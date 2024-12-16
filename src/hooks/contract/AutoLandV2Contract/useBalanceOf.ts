import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import AutoLandVaultV2 from '../../../abis/AutoLandVaultV2.json';
import { AUTO_LAND_V2_CONTRACT_ADDRESS } from "../../../config/constants/environments";

export default function useBalanceOf() {
  const { data, isError, isLoading, error, refetch } = useReadContract({
    address: AUTO_LAND_V2_CONTRACT_ADDRESS,
    abi: AutoLandVaultV2,
    functionName: "balanceOf",
    args: [],
    chainId: bsc.id
  })

  if (isLoading) return { data: 0, refetch, isLoading }
  if (isError) {
    console.log('Fetching autoVaultv2 getting balanceOf error', error)
    return { data: 0, refetch, isLoading: false }
  }

  return { data, refetch, isLoading }
}
