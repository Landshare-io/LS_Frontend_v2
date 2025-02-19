import { useReadContract } from "wagmi";
import { bsc } from "viem/chains";
import RwaContractAbi from "../../../abis/RWAContract.json";
import { RWA_CONTRACT_ADDRESS } from "../../../config/constants/environments";
import { Address } from "viem";

export default function useGetAllowedToTransfer(chainId: number, address: Address | undefined) {
  const { data, isError, isLoading, error } = useReadContract({
    address: RWA_CONTRACT_ADDRESS[chainId],
    abi: RwaContractAbi,
    functionName: "getAllowedToTransfer",
    chainId: chainId,
    args: [address]
  })

  if (typeof address == 'undefined') return { data: 0, isLoading }
  if (isLoading) return { data: 0, isLoading }
  if (isError) {
    console.log('Fetching LandshareSaleContract getAllowedToTransfer error', error)
    return { data: 0, isLoading }
  }

  return { data, isLoading }
}
